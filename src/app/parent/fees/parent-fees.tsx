"use client";

import { FeeBill } from "@/components/fee-bill";
import { ChildSwitcher, useChild } from "../child-context";

export function ParentFees() {
  const { child } = useChild();
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

      <div className="grid gap-2 sm:grid-cols-2 lg:max-w-xl">
        <button className="h-12 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-600">
          Upload bank teller
        </button>
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
