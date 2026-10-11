# Tolayope's Group of School app

School app for Tolayope's Group of School, Abule Egba, Lagos. It serves parents, students, teachers and office staff, from Creche through SS 3.

Parents, students and teachers can use it on a phone, tablet or computer. The staff portal (`/admin`) works on laptop and desktop screens only.

## What is here

- **Sign in** (`/`): pick parent, student, teacher or staff. Students use their admission number and a PIN.
- **Parents** (`/parent`): child switcher, today's attendance, fee balance and bill, uploading a bank teller, report card.
- **Students** (`/student`): today's classes, attendance, notices, the weekly timetable and their report card.
- **Teachers** (`/teacher`): the daily class register, and CA and exam score entry with live totals and grades.
- **Staff** (`/admin`): dashboard; students list with search and enrolment; attendance by class with reminders; fees and receipts; results with publishing to parents; classes and subjects; school settings.

The screens run on sample data in `src/lib/demo-data.ts` until the Supabase project is connected.

## Database

`supabase/migrations` holds the schema: sessions and terms, classes and subjects, students and guardians, attendance, fee items and invoices, payments with receipts, CA and exam scores, and early-years skill ratings. Every table has row-level security. Parents see only their own children, teachers only the classes they teach, and results stay hidden until office staff publish them. Money is stored in kobo.

`supabase/seed.sql` loads the school, its 15 classes, the 13 fee items from the school's fee bill, the CA1/CA2/Exam split (20/20/60) and the grade bands.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (grading, money)
npm run test:db    # applies the schema to a throwaway local Postgres 16 and runs the access-rule tests
```

`test:db` needs Postgres 16 installed locally; it does not touch any hosted database.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (Postgres, auth, storage), Vitest.
