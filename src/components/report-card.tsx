import { DownloadIcon } from "@/components/icons";
import type { ReportRow } from "@/lib/demo-data";
import { average, gradeFor, ordinal } from "@/lib/grading";

export type Report = {
  name: string;
  className: string;
  term: string;
  present: number;
  schoolDays: number;
  position: number;
  classSize: number;
  rows: ReportRow[];
  classTeacherComment: string;
  headComment: string;
};

const gradeStyle: Record<string, string> = {
  A: "bg-lime-100 text-brand",
  B: "bg-sun-100 text-warn",
};

// One term's report card: scores by subject, average, position, attendance and comments.
export function ReportCard({ report }: { report: Report }) {
  const rows = report.rows.map((r) => {
    const total = r.ca1 + r.ca2 + r.exam;
    return { ...r, total, grade: gradeFor(total).grade };
  });
  const avg = average(rows.map((r) => r.total));

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">
            {report.name}
          </h1>
          <p className="text-sm text-muted">
            {report.className} · {report.term}
          </p>
        </div>
        <button className="flex h-11 shrink-0 items-center gap-2 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-sm font-bold text-brand">
          <DownloadIcon size={18} />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sr-only sm:hidden">Download PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:max-w-2xl md:gap-4">
        <div className="flex flex-col rounded-2xl bg-brand p-3 md:p-4">
          <span className="text-xs font-semibold text-lime-200">Average</span>
          <span className="text-2xl font-extrabold text-white">{avg}%</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-line bg-white p-3 md:p-4">
          <span className="text-xs font-semibold text-muted">Position</span>
          <span className="text-2xl font-extrabold">
            {ordinal(report.position)}
            <span className="text-sm font-semibold text-muted"> / {report.classSize}</span>
          </span>
        </div>
        <div className="flex flex-col rounded-2xl border border-line bg-white p-3 md:p-4">
          <span className="text-xs font-semibold text-muted">Present</span>
          <span className="text-2xl font-extrabold">
            {report.present}
            <span className="text-sm font-semibold text-muted"> / {report.schoolDays}</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[340px] text-sm">
            <caption className="sr-only">Scores by subject</caption>
            <thead>
              <tr className="bg-lime-50 text-xs font-bold text-muted">
                <th scope="col" className="px-3 py-2.5 text-left md:px-5">Subject</th>
                <th scope="col" className="px-2 py-2.5 text-right">CA1</th>
                <th scope="col" className="px-2 py-2.5 text-right">CA2</th>
                <th scope="col" className="px-2 py-2.5 text-right">Exam</th>
                <th scope="col" className="px-2 py-2.5 text-right">Total</th>
                <th scope="col" className="px-3 py-2.5 text-center md:px-5">Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.subject} className="border-t border-line">
                  <th scope="row" className="px-3 py-2.5 text-left font-semibold md:px-5">{r.subject}</th>
                  <td className="px-2 py-2.5 text-right text-muted">{r.ca1}</td>
                  <td className="px-2 py-2.5 text-right text-muted">{r.ca2}</td>
                  <td className="px-2 py-2.5 text-right text-muted">{r.exam}</td>
                  <td className="px-2 py-2.5 text-right font-bold">{r.total}</td>
                  <td className="px-3 py-2.5 md:px-5">
                    <span className={`block rounded-md py-0.5 text-center text-xs font-extrabold ${gradeStyle[r.grade] ?? "bg-line text-muted"}`}>
                      {r.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-3 py-2 text-xs text-muted md:px-5">
            CA1 and CA2 out of 20 each, exam out of 60
          </p>
        </section>

        <section className="flex flex-col gap-3 self-start rounded-2xl border border-line bg-white p-4 md:p-5">
          <div>
            <h2 className="text-xs font-bold text-brand-600">Class teacher</h2>
            <p className="text-sm leading-relaxed">{report.classTeacherComment}</p>
          </div>
          <div>
            <h2 className="text-xs font-bold text-brand-600">Head teacher</h2>
            <p className="text-sm leading-relaxed">{report.headComment}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
