"use client";

import { useState } from "react";
import { demoAdmin } from "@/lib/demo-data";
import { formatNaira, formatNairaShort, paidPercent } from "@/lib/money";

const card = "rounded-2xl border border-line bg-white p-5";

export function Dashboard() {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const pending = demoAdmin.tellers.filter((t) => !confirmed.has(t.id)).length;
  const presentTotal = demoAdmin.sections.reduce((s, x) => s + x.present, 0);
  const enrolledTotal = demoAdmin.sections.reduce((s, x) => s + x.enrolled, 0);
  const collectedPct = paidPercent(demoAdmin.billedKobo, demoAdmin.collectedKobo);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Good morning, Bursar</h1>
          <p className="text-sm text-muted">
            {demoAdmin.term} · {demoAdmin.date}
          </p>
        </div>
        <button className="h-11 rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-sm font-bold">
          Print fee bills
        </button>
        <button className="h-11 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-600">
          Enrol a student
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Students enrolled</span>
          <span className="text-3xl font-extrabold">{demoAdmin.enrolled}</span>
          <span className="text-xs text-muted">Creche to SS3, {demoAdmin.classes} classes</span>
        </div>
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Present today</span>
          <span className="text-3xl font-extrabold">{Math.round((presentTotal / enrolledTotal) * 100)}%</span>
          <span className="text-xs text-muted">
            {demoAdmin.registersIn} of {demoAdmin.classes} registers submitted
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl bg-brand p-5">
          <span className="text-sm font-semibold text-lime-200">Fees collected this term</span>
          <span className="text-3xl font-extrabold text-white">{formatNairaShort(demoAdmin.collectedKobo)}</span>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-1.5 bg-sun" style={{ width: `${collectedPct}%` }} />
          </div>
          <span className="text-xs text-lime-200">
            {collectedPct}% of {formatNairaShort(demoAdmin.billedKobo)} billed
          </span>
        </div>
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Tellers to confirm</span>
          <span className="text-3xl font-extrabold">{pending}</span>
          <span className="text-xs text-muted">Uploaded by parents</span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-4">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold">Bank tellers waiting for confirmation</h2>
            <span className="text-sm text-muted">Confirming issues the official receipt</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-5 py-2.5">Pupil</th>
                <th scope="col" className="px-3 py-2.5">Class</th>
                <th scope="col" className="px-3 py-2.5">Amount</th>
                <th scope="col" className="px-3 py-2.5">Bank</th>
                <th scope="col" className="w-36 px-5 py-2.5"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {demoAdmin.tellers.map((t) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="px-5 py-2.5 font-semibold">{t.pupil}</td>
                  <td className="px-3 py-2.5 text-muted">{t.className}</td>
                  <td className="px-3 py-2.5 font-bold">{formatNaira(t.amountKobo)}</td>
                  <td className="px-3 py-2.5 text-muted">{t.bank}</td>
                  <td className="px-5 py-2">
                    {confirmed.has(t.id) ? (
                      <span className="flex h-9.5 items-center justify-center rounded-xl bg-lime-100 text-[13px] font-bold text-brand">
                        Receipt issued
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmed((s) => new Set(s).add(t.id))}
                        className="h-9.5 w-full rounded-xl bg-brand text-[13px] font-bold text-white hover:bg-brand-600"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={`${card} flex flex-col gap-3.5`}>
          <h2 className="font-bold">Attendance today by section</h2>
          {demoAdmin.sections.map((s) => {
            const pct = Math.round((s.present / s.enrolled) * 100);
            return (
              <div key={s.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-muted">
                    {s.present} of {s.enrolled} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <div className="h-2.5 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="mt-auto rounded-xl border border-sun-300 bg-sun-50 px-3.5 py-3">
            <p className="text-sm font-bold">{demoAdmin.missingRegisters.length} registers not yet submitted</p>
            <p className="text-sm text-muted">{demoAdmin.missingRegisters.join(", ")}.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
