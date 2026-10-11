"use client";

import { useState } from "react";
import { demoAdmin, demoClasses, demoFrequentAbsence } from "@/lib/demo-data";

const card = "rounded-2xl border border-line bg-white p-5";

export function Attendance() {
  const [missingOnly, setMissingOnly] = useState(false);
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const submitted = demoClasses.filter((c) => c.present !== null);
  const present = submitted.reduce((s, c) => s + (c.present ?? 0), 0);
  const counted = submitted.reduce((s, c) => s + c.pupils, 0);
  const late = submitted.reduce((s, c) => s + c.late, 0);
  const rows = missingOnly ? demoClasses.filter((c) => c.present === null) : demoClasses;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Attendance</h1>
        <p className="text-sm text-muted">
          {demoAdmin.date} · Morning registers
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Registers in</span>
          <span className="text-3xl font-extrabold">
            {submitted.length}
            <span className="text-lg text-muted"> / {demoClasses.length}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl bg-brand p-5">
          <span className="text-sm font-semibold text-lime-200">Present</span>
          <span className="text-3xl font-extrabold text-white">{Math.round((present / counted) * 100)}%</span>
          <span className="text-xs text-lime-200">
            {present} of {counted} in submitted registers
          </span>
        </div>
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Absent</span>
          <span className="text-3xl font-extrabold text-alert">{counted - present}</span>
        </div>
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Late</span>
          <span className="text-3xl font-extrabold text-warn">{late}</span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold">By class</h2>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={missingOnly}
                onChange={(e) => setMissingOnly(e.target.checked)}
                className="size-4 accent-brand"
              />
              Not submitted only
            </label>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-5 py-2.5">Class</th>
                <th scope="col" className="px-3 py-2.5">Class teacher</th>
                <th scope="col" className="px-3 py-2.5 text-right">Present</th>
                <th scope="col" className="px-3 py-2.5 text-right">Absent</th>
                <th scope="col" className="px-3 py-2.5 text-right">Late</th>
                <th scope="col" className="w-40 px-5 py-2.5"><span className="sr-only">Status</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.name} className="border-t border-line">
                  <th scope="row" className="px-5 py-2.5 text-left font-semibold">{c.name}</th>
                  <td className="px-3 py-2.5 text-muted">{c.teacher}</td>
                  {c.present === null ? (
                    <>
                      <td colSpan={3} className="px-3 py-2.5 text-right font-semibold text-warn">
                        Register not submitted
                      </td>
                      <td className="px-5 py-2">
                        {reminded.has(c.name) ? (
                          <span className="flex h-9 items-center justify-center rounded-xl bg-lime-100 text-[13px] font-bold text-brand">
                            Reminder sent
                          </span>
                        ) : (
                          <button
                            onClick={() => setReminded((s) => new Set(s).add(c.name))}
                            aria-label={`Remind ${c.teacher} to submit the ${c.name} register`}
                            className="h-9 w-full rounded-xl border-[1.5px] border-line-strong bg-white text-[13px] font-bold text-brand"
                          >
                            Remind teacher
                          </button>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2.5 text-right font-bold">
                        {c.present}
                        <span className="font-normal text-muted"> / {c.pupils}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-alert">{c.pupils - c.present}</td>
                      <td className="px-3 py-2.5 text-right text-warn">{c.late}</td>
                      <td className="px-5 py-2.5 text-center text-xs font-bold text-brand-600">Submitted</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="self-start overflow-hidden rounded-2xl border border-line bg-white">
          <div className="px-5 py-4">
            <h2 className="font-bold">Absent most often this term</h2>
            <p className="text-sm text-muted">Worth a call to the parent</p>
          </div>
          <ul>
            {demoFrequentAbsence.map((p) => (
              <li key={p.name} className="flex items-center gap-3 border-t border-line px-5 py-2.5 text-sm">
                <div className="flex flex-1 flex-col">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs text-muted">
                    {p.className} · {p.guardian}, {p.phone}
                  </span>
                </div>
                <span className="font-bold text-alert">{p.absent} days</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
