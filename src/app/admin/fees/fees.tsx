"use client";

import { useState } from "react";
import { demoAdmin, demoFeesByClass, demoStudents } from "@/lib/demo-data";
import { formatNaira, formatNairaShort, paidPercent } from "@/lib/money";
import { TellerTable } from "../teller-table";

const card = "rounded-2xl border border-line bg-white p-5";

export function Fees() {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const confirmedKobo = demoAdmin.tellers.filter((t) => confirmed.has(t.id)).reduce((s, t) => s + t.amountKobo, 0);
  const collected = demoAdmin.collectedKobo + confirmedKobo;
  const outstanding = demoAdmin.billedKobo - collected;
  const owing = demoStudents.filter((s) => s.balanceKobo > 0).sort((a, b) => b.balanceKobo - a.balanceKobo);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Fees and receipts</h1>
          <p className="text-sm text-muted">{demoAdmin.term}</p>
        </div>
        <button className="h-11 rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-sm font-bold">
          Print fee bills
        </button>
      </div>

      <p className="rounded-xl border border-sun-300 bg-sun-50 px-4 py-3 text-sm">
        <span className="font-bold">Sample amounts.</span> The real fee for each class goes in once the school confirms
        its fee schedule. The 13 fee items already match the school&apos;s fee bill.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Billed this term</span>
          <span className="text-3xl font-extrabold">{formatNairaShort(demoAdmin.billedKobo)}</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl bg-brand p-5">
          <span className="text-sm font-semibold text-lime-200">Collected</span>
          <span className="text-3xl font-extrabold text-white">{formatNairaShort(collected)}</span>
          <span className="text-xs text-lime-200">{paidPercent(demoAdmin.billedKobo, collected)}% of billed</span>
        </div>
        <div className={`${card} flex flex-col gap-1.5`}>
          <span className="text-sm font-semibold text-muted">Outstanding</span>
          <span className="text-3xl font-extrabold text-alert">{formatNairaShort(outstanding)}</span>
          <span className="text-xs text-muted">Carries forward as &ldquo;outstanding bill&rdquo; next term</span>
        </div>
      </div>

      <TellerTable confirmed={confirmed} onConfirm={(id) => setConfirmed((s) => new Set(s).add(id))} />

      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <h2 className="px-5 py-4 font-bold">Collection by class</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-5 py-2.5">Class</th>
                <th scope="col" className="px-3 py-2.5 text-right">Pupils</th>
                <th scope="col" className="px-3 py-2.5 text-right">Billed</th>
                <th scope="col" className="px-3 py-2.5 text-right">Collected</th>
                <th scope="col" className="w-40 px-5 py-2.5">Paid</th>
              </tr>
            </thead>
            <tbody>
              {demoFeesByClass.map((c) => {
                const pct = paidPercent(c.billedKobo, c.collectedKobo);
                return (
                  <tr key={c.className} className="border-t border-line">
                    <th scope="row" className="px-5 py-2.5 text-left font-semibold">{c.className}</th>
                    <td className="px-3 py-2.5 text-right text-muted">{c.pupils}</td>
                    <td className="px-3 py-2.5 text-right">{formatNairaShort(c.billedKobo)}</td>
                    <td className="px-3 py-2.5 text-right font-bold">{formatNairaShort(c.collectedKobo)}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                          <div className="h-2 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-9 text-right text-xs text-muted">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <h2 className="px-5 py-4 font-bold">Largest balances owed</h2>
          <ul>
            {owing.map((s) => (
              <li key={s.id} className="flex items-center gap-3 border-t border-line px-5 py-2.5 text-sm">
                <div className="flex flex-1 flex-col">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-xs text-muted">
                    {s.className} · {s.guardian}, {s.phone}
                  </span>
                </div>
                <span className="font-bold text-alert">{formatNaira(s.balanceKobo)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
