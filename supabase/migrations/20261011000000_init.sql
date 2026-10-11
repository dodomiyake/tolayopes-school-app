-- Tolayope's School app: core schema for the MVP
-- (school setup, people, attendance, fees, results) with row-level security.
-- Every record carries school_id so the app can serve more than one school later.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'bursar', 'teacher', 'parent', 'student');
create type public.school_section as enum ('creche', 'nursery', 'primary', 'junior_secondary', 'senior_secondary');
create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
create type public.payment_method as enum ('bank_teller', 'bank_transfer', 'cash', 'pos', 'online');
create type public.payment_status as enum ('pending', 'confirmed', 'rejected');
create type public.result_status as enum ('draft', 'submitted', 'approved', 'published');

-- ---------------------------------------------------------------------------
-- School setup
-- ---------------------------------------------------------------------------
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  motto text,
  address text,
  phone text,
  logo_path text,
  created_at timestamptz not null default now()
);

create table public.academic_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  name text not null,                       -- e.g. '2026/2027'
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  unique (school_id, name),
  check (ends_on > starts_on)
);
create unique index academic_sessions_one_current
  on public.academic_sessions (school_id) where is_current;

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  session_id uuid not null references public.academic_sessions (id) on delete cascade,
  term_number smallint not null check (term_number between 1 and 3),
  starts_on date not null,
  ends_on date not null,
  resumption_on date,
  is_current boolean not null default false,
  unique (session_id, term_number),
  check (ends_on > starts_on)
);
create unique index terms_one_current on public.terms (school_id) where is_current;

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  section public.school_section not null,
  name text not null,                       -- e.g. 'Primary 4', 'JSS 1'
  arm text not null default '',             -- e.g. 'A'
  level smallint not null,                  -- ordering and promotion: creche = 0 upwards
  unique (school_id, name, arm)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  name text not null,
  unique (school_id, name)
);

create table public.class_subjects (
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  primary key (class_id, subject_id)
);

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
-- One profile per signed-in user (id = auth.users.id).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  role public.app_role not null,
  full_name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  admission_no text not null,
  first_name text not null,
  last_name text not null,
  other_names text,
  gender text check (gender in ('female', 'male')),
  date_of_birth date,
  class_id uuid references public.classes (id) on delete set null,
  photo_path text,
  medical_notes text,
  user_id uuid unique references public.profiles (id) on delete set null,  -- JSS/SS students who sign in
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (school_id, admission_no)
);
create index students_class_idx on public.students (class_id);

-- Parents and guardians linked to each child. One parent login covers all their children.
create table public.guardians (
  student_id uuid not null references public.students (id) on delete cascade,
  parent_id uuid not null references public.profiles (id) on delete cascade,
  relationship text not null default 'parent',
  is_primary boolean not null default false,
  primary key (student_id, parent_id)
);
create index guardians_parent_idx on public.guardians (parent_id);

-- Who may collect a creche or nursery child.
create table public.pickup_contacts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  full_name text not null,
  relationship text not null,
  phone text not null,
  photo_path text
);

-- Which teacher takes which class, and optionally which subject.
create table public.teaching_assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete cascade,  -- null = class teacher
  term_id uuid not null references public.terms (id) on delete cascade
);
create unique index teaching_assignments_unique
  on public.teaching_assignments (teacher_id, class_id, coalesce(subject_id, '00000000-0000-0000-0000-000000000000'::uuid), term_id);

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  attended_on date not null,
  status public.attendance_status not null,
  note text,
  marked_by uuid references public.profiles (id) on delete set null,
  marked_at timestamptz not null default now(),
  unique (student_id, attended_on)
);
create index attendance_class_day_idx on public.attendance (class_id, attended_on);

-- ---------------------------------------------------------------------------
-- Fees (items match the school's paper fee bill)
-- ---------------------------------------------------------------------------
create table public.fee_items (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  name text not null,                       -- Tuition fees, Registration fees, P.E dress ...
  is_compulsory boolean not null default true,
  sort_order smallint not null default 0,
  unique (school_id, name)
);

-- Amount for an item in a given class and term (kobo avoids rounding errors).
create table public.fee_rates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  fee_item_id uuid not null references public.fee_items (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo >= 0),
  unique (fee_item_id, class_id, term_id)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  issued_at timestamptz not null default now(),
  unique (student_id, term_id)
);

create table public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  fee_item_id uuid references public.fee_items (id) on delete set null,
  description text not null,                -- copied so old bills stay readable
  amount_kobo bigint not null check (amount_kobo >= 0)
);

create sequence public.receipt_no_seq start 1000;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo > 0),
  method public.payment_method not null default 'bank_teller',
  bank_name text,
  teller_ref text,
  teller_file_path text,                    -- photo of the bank teller uploaded by the parent
  paid_on date,
  status public.payment_status not null default 'pending',
  submitted_by uuid references public.profiles (id) on delete set null,
  confirmed_by uuid references public.profiles (id) on delete set null,
  confirmed_at timestamptz,
  receipt_no bigint unique,                 -- issued only when the bursar confirms
  created_at timestamptz not null default now(),
  check ((status = 'confirmed') = (receipt_no is not null))
);
create index payments_invoice_idx on public.payments (invoice_id);

-- What each student owes per term. Only confirmed payments count.
create view public.invoice_balances with (security_invoker = true) as
select
  i.id as invoice_id,
  i.school_id,
  i.student_id,
  i.term_id,
  coalesce((select sum(l.amount_kobo) from public.invoice_lines l where l.invoice_id = i.id), 0) as billed_kobo,
  coalesce((select sum(p.amount_kobo) from public.payments p where p.invoice_id = i.id and p.status = 'confirmed'), 0) as paid_kobo,
  coalesce((select sum(l.amount_kobo) from public.invoice_lines l where l.invoice_id = i.id), 0)
    - coalesce((select sum(p.amount_kobo) from public.payments p where p.invoice_id = i.id and p.status = 'confirmed'), 0) as balance_kobo
from public.invoices i;

-- ---------------------------------------------------------------------------
-- Results
-- ---------------------------------------------------------------------------
-- Score components per section, e.g. CA1 /20, CA2 /20, Exam /60.
create table public.assessment_components (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  section public.school_section not null,
  name text not null,
  max_score numeric(5, 2) not null check (max_score > 0),
  sort_order smallint not null default 0,
  unique (school_id, section, name)
);

-- Grade bands per section, e.g. A 75 to 100.
create table public.grade_bands (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  section public.school_section not null,
  grade text not null,
  min_total numeric(5, 2) not null,
  max_total numeric(5, 2) not null,
  remark text,
  unique (school_id, section, grade),
  check (max_total >= min_total)
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  component_id uuid not null references public.assessment_components (id) on delete cascade,
  score numeric(5, 2) not null check (score >= 0),
  entered_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, subject_id, term_id, component_id)
);

-- Creche and nursery are reported with skill ratings, not scores.
create table public.skill_ratings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  skill text not null,                      -- e.g. 'Counts to 20'
  rating smallint not null check (rating between 1 and 5),
  unique (student_id, term_id, skill)
);

create table public.report_comments (
  student_id uuid not null references public.students (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  class_teacher_comment text,
  head_comment text,
  conduct text,
  primary key (student_id, term_id)
);

-- A class's results go live to parents only once published.
create table public.result_publications (
  class_id uuid not null references public.classes (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  status public.result_status not null default 'draft',
  approved_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  primary key (class_id, term_id)
);

-- ---------------------------------------------------------------------------
-- Access helpers (security definer so policies don't recurse through RLS)
-- ---------------------------------------------------------------------------
create function public.my_school_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select school_id from public.profiles where id = auth.uid()
$$;

create function public.my_role() returns public.app_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.is_office_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select role in ('admin', 'bursar') from public.profiles where id = auth.uid()), false)
$$;

create function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select role in ('admin', 'bursar', 'teacher') from public.profiles where id = auth.uid()), false)
$$;

create function public.teaches_class(p_class_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.teaching_assignments ta
    join public.terms t on t.id = ta.term_id and t.is_current
    where ta.teacher_id = auth.uid() and ta.class_id = p_class_id
  )
$$;

-- True when the signed-in user is this student, one of their guardians, or staff who may see them.
create function public.can_see_student(p_student_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.students s
    where s.id = p_student_id
      and s.school_id = (select school_id from public.profiles where id = auth.uid())
      and (
        (select role in ('admin', 'bursar') from public.profiles where id = auth.uid())
        or s.user_id = auth.uid()
        or exists (select 1 from public.guardians g where g.student_id = s.id and g.parent_id = auth.uid())
        or exists (
          select 1 from public.teaching_assignments ta
          join public.terms t on t.id = ta.term_id and t.is_current
          where ta.teacher_id = auth.uid() and ta.class_id = s.class_id
        )
      )
  )
$$;

create function public.results_published(p_student_id uuid, p_term_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.students s
    join public.result_publications rp on rp.class_id = s.class_id and rp.term_id = p_term_id
    where s.id = p_student_id and rp.status = 'published'
  )
$$;

-- The bursar confirms a teller; this issues the official receipt number.
create function public.confirm_payment(p_payment_id uuid) returns bigint
language plpgsql security definer set search_path = '' as $$
declare
  v_receipt bigint;
begin
  if not public.is_office_staff() then
    raise exception 'only office staff can confirm payments' using errcode = '42501';
  end if;
  update public.payments
     set status = 'confirmed',
         confirmed_by = auth.uid(),
         confirmed_at = now(),
         receipt_no = nextval('public.receipt_no_seq')
   where id = p_payment_id
     and status = 'pending'
     and school_id = public.my_school_id()
  returning receipt_no into v_receipt;
  if v_receipt is null then
    raise exception 'payment not found or not pending';
  end if;
  return v_receipt;
end;
$$;

revoke execute on function public.confirm_payment(uuid) from public, anon;
grant execute on function public.confirm_payment(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.schools enable row level security;
alter table public.academic_sessions enable row level security;
alter table public.terms enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.class_subjects enable row level security;
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.guardians enable row level security;
alter table public.pickup_contacts enable row level security;
alter table public.teaching_assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.fee_items enable row level security;
alter table public.fee_rates enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.payments enable row level security;
alter table public.assessment_components enable row level security;
alter table public.grade_bands enable row level security;
alter table public.scores enable row level security;
alter table public.skill_ratings enable row level security;
alter table public.report_comments enable row level security;
alter table public.result_publications enable row level security;

-- School-wide reference data: everyone in the school reads, office staff write.
create policy schools_read on public.schools for select to authenticated using (id = public.my_school_id());
create policy schools_write on public.schools for update to authenticated
  using (id = public.my_school_id() and public.my_role() = 'admin');

do $$
declare t text;
begin
  foreach t in array array['academic_sessions', 'terms', 'classes', 'subjects', 'fee_items',
                           'assessment_components', 'grade_bands', 'fee_rates']
  loop
    execute format('create policy %1$s_read on public.%1$s for select to authenticated using (school_id = public.my_school_id())', t);
    execute format('create policy %1$s_write on public.%1$s for all to authenticated using (school_id = public.my_school_id() and public.is_office_staff()) with check (school_id = public.my_school_id() and public.is_office_staff())', t);
  end loop;
end $$;

create policy class_subjects_read on public.class_subjects for select to authenticated
  using (exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.my_school_id()));
create policy class_subjects_write on public.class_subjects for all to authenticated
  using (public.is_office_staff() and exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.my_school_id()))
  with check (public.is_office_staff() and exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.my_school_id()));

-- Profiles: you see yourself; staff see everyone in the school; office staff manage them.
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or (school_id = public.my_school_id() and public.is_staff()));
create policy profiles_write on public.profiles for all to authenticated
  using (school_id = public.my_school_id() and public.my_role() = 'admin')
  with check (school_id = public.my_school_id() and public.my_role() = 'admin');

-- Students and everything hanging off a student: visible to that student, their guardians,
-- their current teachers and office staff.
create policy students_read on public.students for select to authenticated using (public.can_see_student(id));
create policy students_write on public.students for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());

create policy guardians_read on public.guardians for select to authenticated
  using (parent_id = auth.uid() or public.can_see_student(student_id));
create policy guardians_write on public.guardians for all to authenticated
  using (public.is_office_staff() and public.can_see_student(student_id))
  with check (public.is_office_staff() and public.can_see_student(student_id));

create policy pickup_read on public.pickup_contacts for select to authenticated using (public.can_see_student(student_id));
create policy pickup_write on public.pickup_contacts for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());

create policy assignments_read on public.teaching_assignments for select to authenticated
  using (school_id = public.my_school_id() and (teacher_id = auth.uid() or public.is_office_staff()));
create policy assignments_write on public.teaching_assignments for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());

-- Attendance: the class's teachers mark it; office staff can correct it.
create policy attendance_read on public.attendance for select to authenticated using (public.can_see_student(student_id));
create policy attendance_write on public.attendance for all to authenticated
  using (school_id = public.my_school_id() and (public.is_office_staff() or public.teaches_class(class_id)))
  with check (
    school_id = public.my_school_id()
    and (public.is_office_staff() or public.teaches_class(class_id))
    and exists (select 1 from public.students s where s.id = attendance.student_id and s.class_id = attendance.class_id)
  );

-- Fees.
create policy invoices_read on public.invoices for select to authenticated using (public.can_see_student(student_id));
create policy invoices_write on public.invoices for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());

create policy invoice_lines_read on public.invoice_lines for select to authenticated
  using (exists (select 1 from public.invoices i where i.id = invoice_id and public.can_see_student(i.student_id)));
create policy invoice_lines_write on public.invoice_lines for all to authenticated
  using (public.is_office_staff() and exists (select 1 from public.invoices i where i.id = invoice_id and i.school_id = public.my_school_id()))
  with check (public.is_office_staff() and exists (select 1 from public.invoices i where i.id = invoice_id and i.school_id = public.my_school_id()));

create policy payments_read on public.payments for select to authenticated
  using (exists (select 1 from public.invoices i where i.id = invoice_id and public.can_see_student(i.student_id)));
-- A guardian may submit a pending teller for their own child's invoice; nothing else.
create policy payments_parent_insert on public.payments for insert to authenticated
  with check (
    status = 'pending' and receipt_no is null and confirmed_by is null
    and submitted_by = auth.uid()
    and exists (
      select 1 from public.invoices i join public.guardians g on g.student_id = i.student_id
      where i.id = payments.invoice_id and g.parent_id = auth.uid() and i.school_id = payments.school_id
    )
  );
create policy payments_office_write on public.payments for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());

-- Results: teachers of the class enter them; families see them only once published.
create policy scores_read on public.scores for select to authenticated
  using (
    public.can_see_student(student_id)
    and (public.is_staff() or public.results_published(student_id, term_id))
  );
create policy scores_write on public.scores for all to authenticated
  using (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))))
  with check (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))));

create policy skills_read on public.skill_ratings for select to authenticated
  using (public.can_see_student(student_id) and (public.is_staff() or public.results_published(student_id, term_id)));
create policy skills_write on public.skill_ratings for all to authenticated
  using (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))))
  with check (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))));

create policy comments_read on public.report_comments for select to authenticated
  using (public.can_see_student(student_id) and (public.is_staff() or public.results_published(student_id, term_id)));
create policy comments_write on public.report_comments for all to authenticated
  using (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))))
  with check (school_id = public.my_school_id() and (public.is_office_staff()
         or exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id))));

create policy publications_read on public.result_publications for select to authenticated using (school_id = public.my_school_id());
create policy publications_write on public.result_publications for all to authenticated
  using (school_id = public.my_school_id() and public.is_office_staff())
  with check (school_id = public.my_school_id() and public.is_office_staff());
