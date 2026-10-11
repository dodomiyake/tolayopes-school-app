import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, MegaphoneIcon } from "@/components/icons";
import { demoNotice, demoStudent, demoStudentReport, demoTimetable } from "@/lib/demo-data";
import { average, ordinal } from "@/lib/grading";
import { TimetableDay } from "./timetable-day";

export const metadata: Metadata = { title: "Student home" };

const card = "rounded-[18px] border border-line bg-white p-4 md:p-5";

export default function StudentHome() {
  const s = demoStudent;
  const lastAverage = average(demoStudentReport.rows.map((r) => r.ca1 + r.ca2 + r.exam));

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <p className="text-sm text-muted">Good morning</p>
        <h1 className="text-2xl font-extrabold md:text-[28px]">
          {s.firstName} {s.lastName}
        </h1>
        <p className="text-sm text-muted">
          {s.className} · {s.admissionNo}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <div className={`${card} flex items-center gap-3.5`}>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime-100 text-brand-600">
            <CheckIcon />
          </span>
          <div className="flex flex-col">
            <span className="font-bold">Marked present today</span>
            <span className="text-sm text-muted">
              At {s.markedAt} by {s.classTeacher}
            </span>
          </div>
        </div>

        <div className={`${card} flex flex-col gap-1`}>
          <span className="text-sm font-semibold text-muted">Attendance this term</span>
          <span className="text-3xl font-extrabold text-brand">
            {s.presentDays} / {s.schoolDays}
          </span>
          <span className="text-sm text-muted">days present</span>
        </div>

        <Link href="/student/results" className={`${card} flex flex-col gap-1 bg-brand! text-white md:col-span-2 lg:col-span-1`}>
          <span className="text-sm font-semibold text-lime-200">Last report card</span>
          <span className="text-3xl font-extrabold">{lastAverage}%</span>
          <span className="text-sm text-lime-200">
            3rd term average, {ordinal(demoStudentReport.position)} of {demoStudentReport.classSize}
          </span>
          <span className="mt-1 text-sm font-bold text-sun">Open report card</span>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold">Today&apos;s classes</h2>
            <Link href="/student/timetable" className="text-sm font-bold text-brand">
              Full timetable
            </Link>
          </div>
          <TimetableDay periods={demoTimetable.Monday} />
        </section>

        <section className="flex gap-3 self-start rounded-[18px] border border-sun-300 bg-sun-50 p-4 md:p-5">
          <MegaphoneIcon className="mt-0.5 shrink-0 text-warn" />
          <div>
            <h2 className="font-bold">{demoNotice.title}</h2>
            <p className="text-sm text-muted">{demoNotice.body}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
