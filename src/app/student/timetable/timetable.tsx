"use client";

import { useState } from "react";
import { demoStudent, demoTimetable, weekdays } from "@/lib/demo-data";
import { TimetableDay } from "../timetable-day";

export function Timetable() {
  const [day, setDay] = useState<(typeof weekdays)[number]>("Monday");
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Timetable</h1>
        <p className="text-sm text-muted">{demoStudent.className} · 1st term</p>
      </div>
      <div role="tablist" aria-label="Day" className="grid grid-cols-5 gap-1.5 md:max-w-xl">
        {weekdays.map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={d === day}
            onClick={() => setDay(d)}
            className={`h-11 rounded-xl border-[1.5px] text-sm ${
              d === day ? "border-brand bg-brand font-bold text-white" : "border-line bg-white font-semibold"
            }`}
          >
            <span className="sm:hidden">{d.slice(0, 3)}</span>
            <span className="hidden sm:inline">{d}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={day} className="md:max-w-3xl">
        <TimetableDay periods={demoTimetable[day]} />
      </div>
    </div>
  );
}
