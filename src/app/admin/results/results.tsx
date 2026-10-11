"use client";

import { useState } from "react";
import { demoClasses, demoScoreSheet } from "@/lib/demo-data";

const scoreLabel = { submitted: "Submitted", draft: "Draft", "not started": "Not started" } as const;
const scoreStyle = {
  submitted: "bg-lime-100 text-brand",
  draft: "bg-sun-100 text-warn",
  "not started": "bg-alert-50 text-alert",
} as const;

export function Results() {
  const [published, setPublished] = useState<Set<string>>(
    () => new Set(demoClasses.filter((c) => c.published).map((c) => c.name)),
  );
  const [selected, setSelected] = useState<string>("Primary 4");
  const cls = demoClasses.find((c) => c.name === selected)!;
  const ready = (c: (typeof demoClasses)[number]) => c.subjects.every((s) => s.scores === "submitted");
  const readyCount = demoClasses.filter((c) => ready(c) && !published.has(c.name)).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Results</h1>
        <p className="text-sm text-muted">
          {demoScoreSheet.term} · {published.size} of {demoClasses.length} classes published, {readyCount} ready to
          publish
        </p>
      </div>

      <p className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
        Parents see a report card only after its class is published. A class can be published once every subject&apos;s
        scores are submitted.
      </p>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
        <section className="self-start overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <caption className="sr-only">Results by class</caption>
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-5 py-2.5">Class</th>
                <th scope="col" className="px-3 py-2.5 text-right">Subjects in</th>
                <th scope="col" className="px-5 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoClasses.map((c) => {
                const done = c.subjects.filter((s) => s.scores === "submitted").length;
                const isPub = published.has(c.name);
                return (
                  <tr
                    key={c.name}
                    className={`border-t border-line ${c.name === selected ? "bg-lime-50" : ""}`}
                  >
                    <th scope="row" className="px-5 py-2.5 text-left font-semibold">
                      <button
                        onClick={() => setSelected(c.name)}
                        aria-pressed={c.name === selected}
                        className="text-left underline-offset-2 hover:underline"
                      >
                        {c.name}
                      </button>
                    </th>
                    <td className="px-3 py-2.5 text-right">
                      {done}
                      <span className="text-muted"> / {c.subjects.length}</span>
                    </td>
                    <td className="px-5 py-2.5 text-right text-xs font-bold">
                      {isPub ? (
                        <span className="text-brand-600">Published</span>
                      ) : ready(c) ? (
                        <span className="text-warn">Ready</span>
                      ) : (
                        <span className="text-muted">Waiting on scores</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold">{cls.name}</h2>
              <p className="text-sm text-muted">
                Class teacher {cls.teacher} · {cls.pupils} pupils
              </p>
            </div>
            {published.has(cls.name) ? (
              <span className="flex h-11 items-center rounded-xl bg-lime-100 px-4 text-sm font-bold text-brand">
                Published to parents
              </span>
            ) : (
              <button
                disabled={!ready(cls)}
                onClick={() => setPublished((s) => new Set(s).add(cls.name))}
                className="h-11 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-600 disabled:bg-line disabled:text-muted"
              >
                Publish to parents
              </button>
            )}
          </div>
          <ul className="flex flex-col">
            {cls.subjects.map((s) => (
              <li key={s.name} className="flex items-center gap-3 border-t border-line py-2.5 text-sm first:border-t-0">
                <span className="flex-1 font-semibold">{s.name}</span>
                <span className="text-muted">{s.teacher}</span>
                <span className={`w-24 rounded-full py-1 text-center text-xs font-bold ${scoreStyle[s.scores]}`}>
                  {scoreLabel[s.scores]}
                </span>
              </li>
            ))}
          </ul>
          {!ready(cls) && !published.has(cls.name) && (
            <p className="text-sm text-muted">
              Waiting on {cls.subjects.filter((s) => s.scores !== "submitted").map((s) => `${s.name} (${s.teacher})`).join(", ")}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
