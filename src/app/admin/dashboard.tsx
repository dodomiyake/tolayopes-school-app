"use client";

import Link from "next/link";
import { useState } from "react";
import { demoAdmin, demoClasses } from "@/lib/demo-data";

const sectionNames = ["Creche", "Nursery", "Primary", "Junior secondary", "Senior secondary"] as const;
import { formatNairaShort, paidPercent } from "@/lib/money";
import { TellerTable } from "./teller-table";

const card = "rounded-2xl border border-line bg-white p-5";

export function Dashboard() {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const pending = demoAdmin.tellers.filter((t) => !confirmed.has(t.id)).length;
  const submitted = demoClasses.filter((c) => c.present !== null);
  const missing = demoClasses.filter((c) => c.present === null).map((c) => c.name);
  const presentTotal = submitted.reduce((s, c) => s + (c.present ?? 0), 0);
  const enrolledTotal = submitted.reduce((s, c) => s + c.pupils, 0);
  const sections = sectionNames.map((name) => {
    const rows = submitted.filter((c) => c.section === name);
    return { name, present: rows.reduce((s, c) => s + (c.present ?? 0), 0), enrolled: rows.reduce((s, c) => s + c.pupils, 0) };
  });
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
        <Link
          href="/admin/students"
          className="flex h-11 items-center rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-600"
        >
          Enrol a student
        </Link>
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
            {submitted.length} of {demoClasses.length} registers submitted
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
        <TellerTable confirmed={confirmed} onConfirm={(id) => setConfirmed((s) => new Set(s).add(id))} />

        <section className={`${card} flex flex-col gap-3.5`}>
          <h2 className="font-bold">Attendance today by section</h2>
          {sections.map((s) => {
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
            <p className="text-sm font-bold">{missing.length} registers not yet submitted</p>
            <p className="text-sm text-muted">{missing.join(", ")}.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
