"use client";

import { useState } from "react";
import { demoRegister, demoScoreSheet, type ScoreEntry } from "@/lib/demo-data";
import { gradeFor, scoreError } from "@/lib/grading";

type Key = keyof ScoreEntry;
type Sheet = Record<string, ScoreEntry>;
type Status = "editing" | "saved" | "submitted";

const { components, subjects } = demoScoreSheet;
const pupils = demoRegister.pupils;
const blank: ScoreEntry = { ca1: "", ca2: "", exam: "" };

function emptySheet(): Sheet {
  return Object.fromEntries(pupils.map((p) => [p.id, { ...blank }]));
}

function totalOf(e: ScoreEntry): number | null {
  if (components.some((c) => e[c.key].trim() === "" || scoreError(e[c.key], c.max))) return null;
  return components.reduce((s, c) => s + Number(e[c.key]), 0);
}

export function ScoreSheet() {
  const [subject, setSubject] = useState(subjects[0]);
  const [sheets, setSheets] = useState<Record<string, Sheet>>(() => ({
    [subjects[0]]: { ...emptySheet(), ...(demoScoreSheet.initial as Sheet) },
  }));
  const [status, setStatus] = useState<Record<string, Status>>({});

  const sheet = sheets[subject] ?? emptySheet();
  const current = status[subject] ?? "editing";
  const locked = current === "submitted";

  const setScore = (id: string, key: Key, value: string) => {
    setSheets((s) => ({ ...s, [subject]: { ...sheet, [id]: { ...sheet[id], [key]: value } } }));
    setStatus((s) => ({ ...s, [subject]: "editing" }));
  };

  const errors = pupils.reduce(
    (n, p) => n + components.filter((c) => scoreError(sheet[p.id][c.key], c.max)).length,
    0,
  );
  const complete = pupils.filter((p) => totalOf(sheet[p.id]) !== null).length;
  const missing = pupils.length - complete;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">{demoScoreSheet.className} scores</h1>
        <p className="text-sm text-muted">{demoScoreSheet.term}</p>
      </div>

      <div role="tablist" aria-label="Subject" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {subjects.map((s) => {
          const st = status[s];
          return (
            <button
              key={s}
              role="tab"
              aria-selected={s === subject}
              onClick={() => setSubject(s)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm ${
                s === subject ? "border-brand bg-brand font-bold text-white" : "border-line bg-white font-semibold text-ink"
              }`}
            >
              {s}
              {st === "submitted" && <span className="size-2 rounded-full bg-lime" aria-label="submitted" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-semibold">
          {complete} of {pupils.length} complete
        </span>
        <span className="text-muted">
          {components.map((c) => `${c.label} out of ${c.max}`).join(", ")}
        </span>
      </div>

      {locked && (
        <p className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm">
          <span className="font-bold">Sent to the head teacher.</span> Scores are locked until they are reviewed. Parents
          see them only once results are published.
        </p>
      )}

      <div className="md:overflow-hidden md:rounded-2xl md:border md:border-line md:bg-white">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[2rem_minmax(0,1fr)_repeat(3,5.5rem)_4rem_3.5rem] items-center gap-3 bg-lime-50 px-5 py-2.5 text-xs font-bold text-muted md:grid"
        >
          <span>#</span>
          <span>Pupil</span>
          {components.map((c) => (
            <span key={c.key} className="text-center">
              {c.label} /{c.max}
            </span>
          ))}
          <span className="text-right">Total</span>
          <span className="text-center">Grade</span>
        </div>

        <ul className="grid gap-2 md:gap-0">
          {pupils.map((p, i) => {
            const entry = sheet[p.id];
            const total = totalOf(entry);
            return (
              <li
                key={p.id}
                className="grid grid-cols-3 gap-x-2 gap-y-2 rounded-xl border border-line bg-white p-3 md:grid-cols-[2rem_minmax(0,1fr)_repeat(3,5.5rem)_4rem_3.5rem] md:items-start md:gap-3 md:rounded-none md:border-0 md:border-t md:px-5 md:py-2 md:first:border-t-0"
              >
                <span className="hidden pt-2.5 text-sm text-muted md:block">{i + 1}</span>
                <div className="col-span-3 flex items-center justify-between md:col-span-1 md:pt-2">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-sm md:hidden">
                    {total === null ? (
                      <span className="text-muted">Incomplete</span>
                    ) : (
                      <>
                        <span className="font-bold">{total}</span>
                        <span className="text-muted"> · {gradeFor(total).grade}</span>
                      </>
                    )}
                  </span>
                </div>
                {components.map((c) => {
                  const err = scoreError(entry[c.key], c.max);
                  const id = `${p.id}-${c.key}`;
                  return (
                    <div key={c.key} className="flex flex-col gap-1">
                      <label htmlFor={id} className="text-xs font-semibold text-muted md:sr-only">
                        {c.label} /{c.max}
                        <span className="sr-only"> for {p.name}</span>
                      </label>
                      <input
                        id={id}
                        inputMode="decimal"
                        autoComplete="off"
                        value={entry[c.key]}
                        disabled={locked}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? `${id}-err` : undefined}
                        onChange={(e) => setScore(p.id, c.key, e.target.value)}
                        className={`h-11 w-full rounded-xl border-[1.5px] bg-white text-center text-base font-semibold disabled:bg-ground disabled:text-muted ${
                          err ? "border-alert text-alert" : "border-line-strong"
                        }`}
                      />
                      {err && (
                        <span id={`${id}-err`} className="text-center text-xs font-semibold text-alert">
                          {err}
                        </span>
                      )}
                    </div>
                  );
                })}
                <span className="hidden pt-2.5 text-right font-bold md:block">{total ?? "–"}</span>
                <span className="hidden pt-2 md:block">
                  {total !== null && (
                    <span className="block rounded-md py-1 text-center text-xs font-extrabold bg-lime-100 text-brand">
                      {gradeFor(total).grade}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky bottom-[78px] -mx-4 grid grid-cols-2 gap-2 border-t border-line bg-ground px-4 py-3 md:static md:mx-0 md:flex md:items-center md:justify-end md:gap-3 md:border-0 md:bg-transparent md:p-0">
        <p role="status" className="col-span-2 text-sm text-muted md:mr-auto">
          {errors > 0
            ? `Fix ${errors} ${errors === 1 ? "score" : "scores"} marked in red before saving.`
            : current === "saved"
              ? "Draft saved. You can come back and finish later."
              : locked
                ? ""
                : missing > 0
                  ? `${missing} ${missing === 1 ? "pupil is" : "pupils are"} still missing a score.`
                  : "All scores entered."}
        </p>
        <button
          disabled={locked || errors > 0}
          onClick={() => setStatus((s) => ({ ...s, [subject]: "saved" }))}
          className="h-12 rounded-2xl border-[1.5px] border-line-strong bg-white px-5 font-bold text-brand disabled:border-line disabled:bg-line disabled:text-muted md:w-44"
        >
          Save draft
        </button>
        <button
          disabled={locked || errors > 0 || missing > 0}
          onClick={() => setStatus((s) => ({ ...s, [subject]: "submitted" }))}
          className="h-12 rounded-2xl bg-brand px-5 font-bold text-white hover:bg-brand-600 disabled:bg-line disabled:text-muted md:w-64"
        >
          {locked ? "Sent for review" : (
            <>
              Send<span className="hidden sm:inline"> to head teacher</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
