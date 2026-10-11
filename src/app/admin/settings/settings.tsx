"use client";

import { useState } from "react";
import { demoSettings } from "@/lib/demo-data";
import { defaultBands } from "@/lib/grading";

const field = "h-11 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-sm font-normal";
const label = "flex flex-col gap-1.5 text-sm font-semibold";

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [splitError, setSplitError] = useState<string | null>(null);

  function save(form: FormData) {
    const total = ["CA1", "CA2", "Exam"].reduce((s, n) => s + Number(form.get(`max-${n}`)), 0);
    if (total !== 100) {
      setSplitError(`They add up to ${total}, not 100.`);
      setSaved(false);
      return;
    }
    setSplitError(null);
    setSaved(true);
  }

  return (
    <form
      action={save}
      onChange={() => setSaved(false)}
      className="flex flex-col gap-5"
      aria-label="School settings"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Settings</h1>
          <p role="status" className="text-sm text-muted">
            {splitError ? "Not saved: fix the score split." : saved ? "Settings saved." : "Changes here apply to the whole school."}
          </p>
        </div>
        <button className="h-11 rounded-xl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-600">Save changes</button>
      </div>

      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="col-span-2 font-bold">School</h2>
        <label className={label}>
          School name
          <input name="name" defaultValue={demoSettings.name} required className={field} />
        </label>
        <label className={label}>
          Motto
          <input name="motto" defaultValue={demoSettings.motto} className={field} />
        </label>
        <label className={label}>
          Address
          <input name="address" defaultValue={demoSettings.address} className={field} />
        </label>
        <label className={label}>
          Phone
          <input name="phone" type="tel" defaultValue={demoSettings.phone} className={field} />
        </label>
      </section>

      <section className="grid grid-cols-5 gap-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="col-span-5 font-bold">Current term</h2>
        <label className={label}>
          Session
          <input name="session" defaultValue={demoSettings.session} className={field} />
        </label>
        <label className={label}>
          Term
          <select name="term" defaultValue={demoSettings.term} className={field}>
            <option>1st term</option>
            <option>2nd term</option>
            <option>3rd term</option>
          </select>
        </label>
        <label className={label}>
          Resumes
          <input name="termStart" type="date" defaultValue={demoSettings.termStart} className={field} />
        </label>
        <label className={label}>
          Mid-term break
          <input name="midTerm" type="date" defaultValue={demoSettings.midTerm} className={field} />
        </label>
        <label className={label}>
          Closes
          <input name="termEnd" type="date" defaultValue={demoSettings.termEnd} className={field} />
        </label>
      </section>

      <section className="grid grid-cols-3 gap-4 rounded-2xl border border-line bg-white p-5">
        <div className="col-span-3">
          <h2 className="font-bold">School bank account</h2>
          <p className="text-sm text-muted">Printed on fee bills so parents know where to pay.</p>
        </div>
        <label className={label}>
          Bank
          <input name="bankName" defaultValue={demoSettings.bankName} placeholder="e.g. First Bank" className={field} />
        </label>
        <label className={label}>
          Account name
          <input name="accountName" defaultValue={demoSettings.accountName} className={field} />
        </label>
        <label className={label}>
          Account number
          <input
            name="accountNumber"
            defaultValue={demoSettings.accountNumber}
            inputMode="numeric"
            pattern="\d{10}"
            title="10-digit NUBAN account number"
            className={field}
          />
        </label>
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold">Scores, primary and secondary</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["CA1", 20],
              ["CA2", 20],
              ["Exam", 60],
            ].map(([name, max]) => (
              <label key={name} className={label}>
                {name} out of
                <input name={`max-${name}`} type="number" min={0} max={100} defaultValue={max} className={field} />
              </label>
            ))}
          </div>
          <p className={`text-sm ${splitError ? "font-semibold text-alert" : "text-muted"}`}>
            The three must add up to 100.{splitError && ` ${splitError}`}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-bold">Grading scale</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
                <th scope="col" className="px-3 py-2">Grade</th>
                <th scope="col" className="px-3 py-2">From</th>
                <th scope="col" className="px-3 py-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {defaultBands.map((b) => (
                <tr key={b.grade} className="border-t border-line">
                  <th scope="row" className="px-3 py-2 text-left font-extrabold">{b.grade}</th>
                  <td className="px-3 py-1.5">
                    <input
                      aria-label={`Lowest total for grade ${b.grade}`}
                      name={`band-${b.grade}`}
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={b.min}
                      className={`${field} h-9 w-20`}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      aria-label={`Remark for grade ${b.grade}`}
                      name={`remark-${b.grade}`}
                      defaultValue={b.remark}
                      className={`${field} h-9 w-full`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </form>
  );
}
