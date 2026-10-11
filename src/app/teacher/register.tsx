"use client";

import { useState } from "react";
import { demoRegister, type Mark } from "@/lib/demo-data";

const nextMark: Record<Mark, Mark> = { present: "absent", absent: "late", late: "present" };
const label: Record<Mark, string> = { present: "Present", absent: "Absent", late: "Late" };
const badge: Record<Mark, string> = {
  present: "bg-lime-100 text-brand",
  absent: "bg-alert-50 text-alert",
  late: "bg-sun-100 text-warn",
};
const chosen: Record<Mark, string> = {
  present: "border-brand-600 bg-lime-100 text-brand font-extrabold",
  absent: "border-alert bg-alert-50 text-alert font-extrabold",
  late: "border-warn bg-sun-100 text-warn font-extrabold",
};
const marks: Mark[] = ["present", "absent", "late"];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export function Register() {
  const [state, setState] = useState<Record<string, Mark>>(() =>
    Object.fromEntries(demoRegister.pupils.map((p) => [p.id, demoRegister.initialMarks[p.id] ?? "present"])),
  );
  const [submitted, setSubmitted] = useState(false);
  const set = (id: string, m: Mark) => {
    setSubmitted(false);
    setState((s) => ({ ...s, [id]: m }));
  };
  const count = (m: Mark) => Object.values(state).filter((x) => x === m).length;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">{demoRegister.className} register</h1>
        <p className="text-sm text-muted">
          {demoRegister.date} · Morning · {demoRegister.teacher}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:max-w-xl md:gap-3">
        {marks.map((m) => (
          <div key={m} className={`flex flex-col rounded-2xl p-3 md:p-4 ${badge[m]}`}>
            <span className="text-2xl font-extrabold">{count(m)}</span>
            <span className="text-xs font-semibold">{label[m]}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="md:hidden">Tap a pupil to change their mark.</span>
          <span className="hidden md:inline">Choose a mark for each pupil.</span>
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setState((s) => Object.fromEntries(Object.keys(s).map((k) => [k, "present" as Mark])));
          }}
          className="h-10 shrink-0 rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-sm font-bold text-brand"
        >
          All present
        </button>
      </div>

      <ul className="grid gap-2 md:grid-cols-1 md:gap-0 md:overflow-hidden md:rounded-2xl md:border md:border-line md:bg-white">
        {demoRegister.pupils.map((p, i) => {
          const m = state[p.id];
          return (
            <li key={p.id} className="md:border-t md:border-line md:first:border-t-0">
              {/* Phones: one big tap target that cycles Present, Absent, Late. */}
              <button
                onClick={() => set(p.id, nextMark[m])}
                aria-label={`${p.name}: ${label[m]}. Tap to change.`}
                className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-line bg-white py-1.5 pr-2 pl-3 text-left md:hidden"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime-50 text-[13px] font-bold text-brand">
                  {initials(p.name)}
                </span>
                <span className="flex-1 font-semibold">{p.name}</span>
                <span className={`min-w-[76px] rounded-full px-2.5 py-1.5 text-center text-xs font-extrabold ${badge[m]}`}>
                  {label[m]}
                </span>
              </button>

              {/* Tablet and desktop: all three choices side by side. */}
              <div className="hidden items-center gap-4 px-5 py-2 md:flex">
                <span className="w-6 text-sm text-muted">{i + 1}</span>
                <span className="flex-1 font-semibold">{p.name}</span>
                <div role="radiogroup" aria-label={`Mark for ${p.name}`} className="grid w-[330px] grid-cols-3 gap-1.5">
                  {marks.map((opt) => (
                    <button
                      key={opt}
                      role="radio"
                      aria-checked={m === opt}
                      onClick={() => set(p.id, opt)}
                      className={`h-10 rounded-xl border-[1.5px] text-sm ${
                        m === opt ? chosen[opt] : "border-line bg-white font-semibold text-muted"
                      }`}
                    >
                      {label[opt]}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-24 md:static md:flex md:justify-end">
        <button
          onClick={() => setSubmitted(true)}
          className="h-13 w-full rounded-2xl bg-brand text-base font-bold text-white shadow-sm hover:bg-brand-600 md:w-80"
        >
          {submitted ? "Register submitted" : "Submit register"}
        </button>
      </div>
      <p role="status" className="sr-only">
        {submitted ? "Register submitted" : ""}
      </p>
    </div>
  );
}
