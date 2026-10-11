"use client";

import { useState } from "react";
import { classNames, demoStudents, type Student } from "@/lib/demo-data";
import { formatNaira } from "@/lib/money";

const field = "h-11 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-sm";

export function Students() {
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [query, setQuery] = useState("");
  const [klass, setKlass] = useState("");
  const [owing, setOwing] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const shown = students.filter(
    (s) =>
      (!q || s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q) || s.guardian.toLowerCase().includes(q)) &&
      (!klass || s.className === klass) &&
      (!owing || s.balanceKobo > 0),
  );

  function enrol(form: FormData) {
    const next = students.length + 101;
    const s: Student = {
      id: `new-${next}`,
      admissionNo: `TGS/26/${String(next).padStart(4, "0")}`,
      name: `${form.get("first")} ${form.get("last")}`.trim(),
      className: form.get("class") as Student["className"],
      gender: form.get("gender") as Student["gender"],
      guardian: String(form.get("guardian")),
      phone: String(form.get("phone")),
      balanceKobo: 0,
    };
    setStudents((list) => [s, ...list]);
    setJustAdded(s.id);
    setEnrolling(false);
    setQuery("");
    setKlass("");
    setOwing(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Students</h1>
          <p className="text-sm text-muted">{students.length} on the sample roll</p>
        </div>
        <button
          onClick={() => setEnrolling((v) => !v)}
          aria-expanded={enrolling}
          className="h-11 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-600"
        >
          {enrolling ? "Close form" : "Enrol a student"}
        </button>
      </div>

      {enrolling && (
        <form
          action={enrol}
          className="grid grid-cols-3 gap-4 rounded-2xl border border-line bg-white p-5"
          aria-label="Enrol a student"
        >
          <h2 className="col-span-3 font-bold">New student</h2>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            First name
            <input name="first" required className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Surname
            <input name="last" required className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Class
            <select name="class" required defaultValue="" className={field}>
              <option value="" disabled>
                Choose a class
              </option>
              {classNames.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <fieldset className="flex flex-col gap-1.5 text-sm font-semibold">
            <legend className="mb-1.5">Gender</legend>
            <div className="flex h-11 items-center gap-5 font-normal">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="F" required className="size-4 accent-brand" /> Female
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="M" className="size-4 accent-brand" /> Male
              </label>
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Parent or guardian
            <input name="guardian" required className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Guardian phone
            <input name="phone" type="tel" required inputMode="tel" placeholder="0803 000 0000" className={field} />
          </label>
          <p className="col-span-2 self-center text-sm text-muted">
            The admission number is given automatically. The guardian gets a sign-in link by text message once the
            database is connected.
          </p>
          <button className="h-11 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-600">Enrol student</button>
        </form>
      )}

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="student-search">
          Search students
        </label>
        <input
          id="student-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, admission number or guardian"
          className={`${field} flex-1`}
        />
        <label className="sr-only" htmlFor="class-filter">
          Class
        </label>
        <select id="class-filter" value={klass} onChange={(e) => setKlass(e.target.value)} className={`${field} w-48`}>
          <option value="">All classes</option>
          {classNames.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-sm font-semibold">
          <input type="checkbox" checked={owing} onChange={(e) => setOwing(e.target.checked)} className="size-4 accent-brand" />
          Owing fees
        </label>
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <caption className="sr-only">Students</caption>
          <thead>
            <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
              <th scope="col" className="px-5 py-2.5">Name</th>
              <th scope="col" className="px-3 py-2.5">Admission no.</th>
              <th scope="col" className="px-3 py-2.5">Class</th>
              <th scope="col" className="px-3 py-2.5">Parent or guardian</th>
              <th scope="col" className="px-3 py-2.5">Phone</th>
              <th scope="col" className="px-5 py-2.5 text-right">Fee balance</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id} className={`border-t border-line ${s.id === justAdded ? "bg-sun-50" : ""}`}>
                <th scope="row" className="px-5 py-2.5 text-left font-semibold">
                  {s.name}
                  {s.id === justAdded && <span className="ml-2 text-xs font-bold text-warn">New</span>}
                </th>
                <td className="px-3 py-2.5 text-muted tabular-nums">{s.admissionNo}</td>
                <td className="px-3 py-2.5">{s.className}</td>
                <td className="px-3 py-2.5">{s.guardian}</td>
                <td className="px-3 py-2.5 text-muted tabular-nums">{s.phone}</td>
                <td className="px-5 py-2.5 text-right">
                  {s.balanceKobo > 0 ? (
                    <span className="font-bold text-alert">{formatNaira(s.balanceKobo)}</span>
                  ) : (
                    <span className="font-semibold text-brand-600">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="border-t border-line px-5 py-6 text-center text-muted">No students match.</p>}
      </section>
    </div>
  );
}
