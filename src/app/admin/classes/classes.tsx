"use client";

import { useState } from "react";
import { demoClasses } from "@/lib/demo-data";

const sections = ["Creche", "Nursery", "Primary", "Junior secondary", "Senior secondary"] as const;

export function Classes() {
  const [selected, setSelected] = useState("Primary 4");
  const cls = demoClasses.find((c) => c.name === selected)!;
  const teachers = new Set(demoClasses.flatMap((c) => [c.teacher, ...c.subjects.map((s) => s.teacher)]));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Classes and subjects</h1>
        <p className="text-sm text-muted">
          {demoClasses.length} classes, {teachers.size} teachers
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4">
        <nav aria-label="Classes" className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-4">
          {sections.map((sec) => (
            <div key={sec} className="flex flex-col gap-1.5">
              <h2 className="px-1 text-xs font-bold text-brand-600">{sec}</h2>
              <div className="grid grid-cols-3 gap-1.5">
                {demoClasses
                  .filter((c) => c.section === sec)
                  .map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelected(c.name)}
                      aria-pressed={c.name === selected}
                      className={`flex h-14 flex-col items-start justify-center rounded-xl border-[1.5px] px-3 text-left ${
                        c.name === selected ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-line-strong"
                      }`}
                    >
                      <span className="text-sm font-bold">{c.name}</span>
                      <span className={`text-xs ${c.name === selected ? "text-lime-200" : "text-muted"}`}>
                        {c.pupils} pupils
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        <section className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-5">
          <div>
            <h2 className="text-lg font-extrabold">{cls.name}</h2>
            <p className="text-sm text-muted">
              {cls.section} · {cls.pupils} pupils · Class teacher {cls.teacher}
            </p>
          </div>
          <table className="w-full text-sm">
            <caption className="sr-only">Subjects taught in {cls.name}</caption>
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-3 py-2.5">Subject</th>
                <th scope="col" className="px-3 py-2.5">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {cls.subjects.map((s) => (
                <tr key={s.name} className="border-t border-line">
                  <th scope="row" className="px-3 py-2.5 text-left font-semibold">{s.name}</th>
                  <td className="px-3 py-2.5">{s.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cls.section === "Creche" || cls.section === "Nursery" ? (
            <p className="text-sm text-muted">Early years classes are assessed with a skills checklist instead of scores.</p>
          ) : (
            <p className="text-sm text-muted">Each subject is scored CA1 out of 20, CA2 out of 20 and exam out of 60.</p>
          )}
        </section>
      </div>
    </div>
  );
}
