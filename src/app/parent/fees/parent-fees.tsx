"use client";

import Link from "next/link";
import { FeeBill } from "@/components/fee-bill";
import { formatNaira } from "@/lib/money";
import { ChildSwitcher, useChild } from "../child-context";

export function ParentFees() {
  const { child, tellers } = useChild();
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">School fees</h1>
          <p className="text-sm text-muted">
            {child.firstName} {child.lastName} · {child.className} · 1st term
          </p>
        </div>
        <ChildSwitcher />
      </div>

      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <FeeBill lines={child.bill} />
      </section>

      {tellers.length > 0 && (
        <section className="overflow-hidden rounded-[18px] border border-line bg-white lg:max-w-xl">
          <h2 className="px-4 pt-4 pb-2 font-bold">Tellers you sent</h2>
          <ul>
            {tellers.map((t) => (
              <li key={t.id} className="flex items-center gap-3 border-t border-line px-4 py-3 text-sm">
                <div className="flex flex-1 flex-col">
                  <span className="font-bold">{formatNaira(t.amountKobo)}</span>
                  <span className="text-xs text-muted">
                    {t.bank} · paid {new Date(`${t.paidOn}T00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <span className="rounded-full bg-sun-100 px-2.5 py-1 text-xs font-bold text-warn">Waiting for the bursar</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:max-w-xl">
        <Link
          href="/parent/fees/teller"
          className="flex h-12 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-600"
        >
          Upload bank teller
        </Link>
        <button className="h-12 rounded-xl border-[1.5px] border-line-strong bg-white text-sm font-semibold">
          Print bill
        </button>
      </div>

      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted">
        <li>All fees are compulsory and not refundable.</li>
        <li>Pay into the school&apos;s bank account, then upload the teller here to get your official receipt.</li>
        <li>Please settle the bill before the first day of resumption.</li>
      </ul>
    </div>
  );
}
