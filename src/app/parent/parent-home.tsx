"use client";

import Link from "next/link";
import { CheckIcon, MegaphoneIcon } from "@/components/icons";
import { FeeBill } from "@/components/fee-bill";
import { demoNotice, demoParent } from "@/lib/demo-data";
import { ordinal } from "@/lib/grading";
import { formatNaira, paidPercent } from "@/lib/money";
import { ChildSwitcher, useChild } from "./child-context";

const card = "rounded-[18px] border border-line bg-white p-4 md:p-5";

export function ParentHome() {
  const { child } = useChild();
  const billed = child.bill.reduce((s, l) => s + l.amountKobo, 0);
  const paid = child.bill.reduce((s, l) => s + l.paidKobo, 0);
  const balance = billed - paid;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted">Good morning</p>
          <h1 className="text-2xl font-extrabold md:text-[28px]">{demoParent.name}</h1>
        </div>
        <ChildSwitcher />
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <div className={`${card} flex items-center gap-3.5 md:col-span-2 lg:col-span-1`}>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime-100 text-brand-600">
            <CheckIcon />
          </span>
          <div className="flex flex-col">
            <span className="font-bold">{child.firstName} is in school today</span>
            <span className="text-sm text-muted">
              Marked present at {child.markedAt} by {child.classTeacher}
            </span>
          </div>
        </div>

        <div className={`${card} flex flex-col gap-3`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-muted">School fees, 1st term</span>
            {balance > 0 ? (
              <span className="rounded-full bg-sun-100 px-2.5 py-1 text-xs font-bold text-warn">
                Due before resumption
              </span>
            ) : (
              <span className="rounded-full bg-lime-100 px-2.5 py-1 text-xs font-bold text-brand">Fully paid</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{formatNaira(balance)}</span>
            <span className="text-sm text-muted">outstanding of {formatNaira(billed)}</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Share of fees paid"
            aria-valuenow={paidPercent(billed, paid)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-2 rounded-full bg-lime" style={{ width: `${paidPercent(billed, paid)}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="h-12 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-600">
              Upload bank teller
            </button>
            <Link
              href="/parent/fees"
              className="flex h-12 items-center justify-center rounded-xl border-[1.5px] border-line-strong text-sm font-semibold"
            >
              View bill
            </Link>
          </div>
        </div>

        <Link href="/parent/report" className={`${card} flex flex-col gap-1 bg-brand! text-white`}>
          <span className="text-sm font-semibold text-lime-200">Last report card</span>
          <span className="text-3xl font-extrabold">{child.lastAverage}%</span>
          <span className="text-sm text-lime-200">
            3rd term average, {ordinal(child.lastPosition)} of {child.classSize}
          </span>
          <span className="mt-1 text-sm font-bold text-sun">Open report card</span>
        </Link>

        <div className={`${card} flex flex-col gap-1`}>
          <span className="text-sm font-semibold text-muted">Attendance this term</span>
          <span className="text-3xl font-extrabold text-brand">
            {child.presentDays} / {child.schoolDays}
          </span>
          <span className="text-sm text-muted">days present</span>
        </div>

        <div className="flex gap-3 rounded-[18px] border border-sun-300 bg-sun-50 p-4 md:p-5 lg:col-span-2">
          <MegaphoneIcon className="mt-0.5 shrink-0 text-warn" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold">{demoNotice.title}</span>
            <span className="text-sm text-muted">{demoNotice.body}</span>
          </div>
        </div>
      </div>

      {/* On wider screens the bill sits on the home page; phones open it from Fees. */}
      <section className="hidden overflow-hidden rounded-[18px] border border-line bg-white lg:block">
        <h2 className="px-5 py-4 font-bold">School fees bill, 1st term</h2>
        <FeeBill lines={child.bill} />
      </section>
    </div>
  );
}
