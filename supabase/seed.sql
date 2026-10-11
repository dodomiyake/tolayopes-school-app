-- Starting data for Tolayope's School: the school, its sections, classes, fee items
-- (from the paper school fees bill) and the default CA + exam scheme.
-- Fee amounts are left out until the school confirms them.

insert into public.schools (id, name, motto, address, phone)
values ('00000000-0000-4000-8000-000000000001', 'Tolayope''s Group of School', 'Citadel of Divine Success',
        '56 Unity Street, Olota Captain, Abule Egba, Lagos State', '08072077422');

insert into public.classes (school_id, section, name, arm, level)
select '00000000-0000-4000-8000-000000000001', c.section::public.school_section, c.name, 'A', c.level
from (values
  ('creche', 'Creche', 0),
  ('nursery', 'Nursery 1', 1), ('nursery', 'Nursery 2', 2),
  ('primary', 'Primary 1', 3), ('primary', 'Primary 2', 4), ('primary', 'Primary 3', 5),
  ('primary', 'Primary 4', 6), ('primary', 'Primary 5', 7), ('primary', 'Primary 6', 8),
  ('junior_secondary', 'JSS 1', 9), ('junior_secondary', 'JSS 2', 10), ('junior_secondary', 'JSS 3', 11),
  ('senior_secondary', 'SS 1', 12), ('senior_secondary', 'SS 2', 13), ('senior_secondary', 'SS 3', 14)
) as c (section, name, level);

insert into public.fee_items (school_id, name, is_compulsory, sort_order)
select '00000000-0000-4000-8000-000000000001', f.name, true, f.ord
from (values
  ('Tuition fees', 1), ('Registration fees', 2), ('P.E dress', 3), ('Uniform', 4), ('Cardigan', 5),
  ('Excursion', 6), ('End of session party', 7), ('Exam', 8), ('Friday wear', 9), ('Report card', 10),
  ('Transportation, Route A', 11), ('Transportation, Route B', 12), ('Maintenance fees', 13)
) as f (name, ord);

-- CA1 /20, CA2 /20, Exam /60 for primary and secondary; to be confirmed by the school.
insert into public.assessment_components (school_id, section, name, max_score, sort_order)
select '00000000-0000-4000-8000-000000000001', s.section::public.school_section, c.name, c.max_score, c.ord
from (values ('primary'), ('junior_secondary'), ('senior_secondary')) as s (section)
cross join (values ('CA1', 20, 1), ('CA2', 20, 2), ('Exam', 60, 3)) as c (name, max_score, ord);

insert into public.grade_bands (school_id, section, grade, min_total, max_total, remark)
select '00000000-0000-4000-8000-000000000001', s.section::public.school_section, g.grade, g.lo, g.hi, g.remark
from (values ('primary'), ('junior_secondary'), ('senior_secondary')) as s (section)
cross join (values ('A', 75, 100, 'Excellent'), ('B', 65, 74.99, 'Very good'), ('C', 55, 64.99, 'Good'),
                   ('D', 45, 54.99, 'Fair'), ('E', 0, 44.99, 'Needs improvement')) as g (grade, lo, hi, remark);
