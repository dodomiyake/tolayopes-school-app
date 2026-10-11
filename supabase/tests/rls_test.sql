-- Access-rule tests. Run by scripts/test-db.sh against a throwaway Postgres.
\set ON_ERROR_STOP on
\set QUIET on

-- Fixtures (as the database owner) ------------------------------------------------
insert into auth.users (id) values
  ('10000000-0000-4000-8000-000000000001'), -- admin
  ('10000000-0000-4000-8000-000000000002'), -- bursar
  ('10000000-0000-4000-8000-000000000003'), -- Primary 4 teacher
  ('10000000-0000-4000-8000-000000000004'), -- JSS 1 teacher
  ('10000000-0000-4000-8000-000000000005'), -- parent of Tobi
  ('10000000-0000-4000-8000-000000000006'); -- parent of Zainab

insert into public.profiles (id, school_id, role, full_name) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'admin', 'Head Admin'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'bursar', 'Bursar'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'teacher', 'Mrs. Okafor'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'teacher', 'Mr. Bello'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'parent', 'Mrs. Adebayo'),
  ('10000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000001', 'parent', 'Mr. Yusuf');

insert into public.academic_sessions (id, school_id, name, starts_on, ends_on, is_current)
values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026/2027', '2026-09-14', '2027-07-23', true);
insert into public.terms (id, school_id, session_id, term_number, starts_on, ends_on, is_current)
values ('30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001',
        '20000000-0000-4000-8000-000000000001', 1, '2026-09-14', '2026-12-18', true);

insert into public.subjects (id, school_id, name)
values ('40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Mathematics');

insert into public.students (id, school_id, admission_no, first_name, last_name, class_id)
select '50000000-0000-4000-8000-000000000001', school_id, 'TS/0001', 'Tobi', 'Adebayo', id
from public.classes where name = 'Primary 4';
insert into public.students (id, school_id, admission_no, first_name, last_name, class_id)
select '50000000-0000-4000-8000-000000000002', school_id, 'TS/0002', 'Zainab', 'Yusuf', id
from public.classes where name = 'JSS 1';

insert into public.guardians (student_id, parent_id, is_primary) values
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', true),
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000006', true);

insert into public.teaching_assignments (school_id, teacher_id, class_id, term_id)
select school_id, '10000000-0000-4000-8000-000000000003', id, '30000000-0000-4000-8000-000000000001'
from public.classes where name = 'Primary 4';
insert into public.teaching_assignments (school_id, teacher_id, class_id, term_id)
select school_id, '10000000-0000-4000-8000-000000000004', id, '30000000-0000-4000-8000-000000000001'
from public.classes where name = 'JSS 1';

insert into public.invoices (id, school_id, student_id, term_id) values
  ('60000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001');
insert into public.invoice_lines (invoice_id, description, amount_kobo) values
  ('60000000-0000-4000-8000-000000000001', 'Tuition fees', 8500000),
  ('60000000-0000-4000-8000-000000000001', 'Exam', 800000);

insert into public.scores (school_id, student_id, subject_id, term_id, component_id, score)
select '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001',
       '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', id, 18
from public.assessment_components where section = 'primary' and name = 'CA1';

create function pg_temp.expect(ok boolean, label text) returns void language plpgsql as $$
begin
  if not ok then raise exception 'FAILED: %', label; end if;
  raise notice 'ok - %', label;
end $$;
grant execute on function pg_temp.expect(boolean, text) to authenticated;

-- Parent of Tobi --------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000005', false);

select pg_temp.expect((select count(*) from public.students) = 1, 'parent sees only their own child');
select pg_temp.expect((select first_name from public.students) = 'Tobi', 'parent sees Tobi');
select pg_temp.expect((select count(*) from public.invoices) = 1, 'parent sees only their child''s invoice');
select pg_temp.expect((select balance_kobo from public.invoice_balances) = 9300000, 'balance is the full bill before any payment');
select pg_temp.expect((select count(*) from public.scores) = 0, 'parent cannot see unpublished results');
select pg_temp.expect((select count(*) from public.profiles) = 1, 'parent sees only their own profile');

insert into public.payments (school_id, invoice_id, amount_kobo, bank_name, submitted_by)
values ('00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 5000000, 'First Bank',
        '10000000-0000-4000-8000-000000000005');
select pg_temp.expect(true, 'parent can upload a teller for their own child');

do $$ begin
  insert into public.payments (school_id, invoice_id, amount_kobo, submitted_by)
  values ('00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000002', 100,
          '10000000-0000-4000-8000-000000000005');
  raise exception 'FAILED: parent paid against another child''s invoice';
exception when insufficient_privilege then raise notice 'ok - parent cannot submit a teller for someone else''s child';
end $$;

do $$ begin
  insert into public.payments (school_id, invoice_id, amount_kobo, submitted_by, status, receipt_no)
  values ('00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 100,
          '10000000-0000-4000-8000-000000000005', 'confirmed', 1);
  raise exception 'FAILED: parent created a confirmed payment';
exception when insufficient_privilege then raise notice 'ok - parent cannot mark their own payment confirmed';
end $$;

do $$ begin
  perform public.confirm_payment((select id from public.payments limit 1));
  raise exception 'FAILED: parent confirmed a payment';
exception when insufficient_privilege then raise notice 'ok - parent cannot issue a receipt';
end $$;

do $$ begin
  insert into public.attendance (school_id, student_id, class_id, term_id, attended_on, status)
  select school_id, id, class_id, '30000000-0000-4000-8000-000000000001', '2026-10-13', 'present' from public.students;
  raise exception 'FAILED: parent marked attendance';
exception when insufficient_privilege then raise notice 'ok - parent cannot mark attendance';
end $$;
reset role;

-- Parent of Zainab ----------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000006', false);
select pg_temp.expect((select count(*) from public.students where first_name = 'Tobi') = 0, 'another parent cannot see Tobi');
select pg_temp.expect((select count(*) from public.payments) = 0, 'another parent cannot see Tobi''s payments');
reset role;

-- Primary 4 teacher ---------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', false);
select pg_temp.expect((select count(*) from public.students) = 1, 'teacher sees only pupils in their class');
select pg_temp.expect((select count(*) from public.scores) = 1, 'teacher sees draft scores for their class');

insert into public.attendance (school_id, student_id, class_id, term_id, attended_on, status, marked_by)
select school_id, id, class_id, '30000000-0000-4000-8000-000000000001', '2026-10-13', 'present', auth.uid()
from public.students where first_name = 'Tobi';
select pg_temp.expect(true, 'teacher can mark their own class register');

do $$ begin
  insert into public.attendance (school_id, student_id, class_id, term_id, attended_on, status)
  select '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', id,
         '30000000-0000-4000-8000-000000000001', '2026-10-13', 'absent'
  from public.classes where name = 'JSS 1';
  raise exception 'FAILED: teacher marked another class';
exception when insufficient_privilege then raise notice 'ok - teacher cannot mark another class''s register';
end $$;

do $$ begin
  insert into public.attendance (school_id, student_id, class_id, term_id, attended_on, status)
  select '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', id,
         '30000000-0000-4000-8000-000000000001', '2026-10-14', 'absent'
  from public.classes where name = 'Primary 4';
  raise exception 'FAILED: teacher filed a JSS pupil under their own class';
exception when insufficient_privilege then raise notice 'ok - teacher cannot file another class''s pupil under their class';
end $$;
reset role;

-- Bursar --------------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', false);
select pg_temp.expect((select count(*) from public.students) = 2, 'bursar sees every student');
select pg_temp.expect((select count(*) from public.payments where status = 'pending') = 1, 'bursar sees the teller waiting');
select pg_temp.expect(public.confirm_payment((select id from public.payments limit 1)) >= 1000, 'bursar confirms the teller and a receipt number is issued');
select pg_temp.expect((select balance_kobo from public.invoice_balances where invoice_id = '60000000-0000-4000-8000-000000000001') = 4300000,
  'balance drops by the confirmed amount');

do $$ begin
  perform public.confirm_payment((select id from public.payments limit 1));
  raise exception 'FAILED: confirmed the same teller twice';
exception when raise_exception then
  if sqlerrm like 'FAILED%' then raise; end if;
  raise notice 'ok - a teller cannot be confirmed twice';
end $$;

insert into public.result_publications (class_id, term_id, school_id, status, published_at)
select id, '30000000-0000-4000-8000-000000000001', school_id, 'published', now() from public.classes where name = 'Primary 4';
reset role;

-- Parent of Tobi, after results are published ---------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000005', false);
select pg_temp.expect((select count(*) from public.scores) = 1, 'parent sees results once published');
select pg_temp.expect((select receipt_no from public.payments) is not null, 'parent sees the receipt number');
reset role;

-- Signed out ----------------------------------------------------------------------
set role anon;
do $$ begin
  perform 1 from public.students;
  raise exception 'FAILED: anonymous visitor read students';
exception when insufficient_privilege then raise notice 'ok - signed-out visitors cannot read anything';
end $$;
reset role;


