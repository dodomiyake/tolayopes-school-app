import type { Period } from "@/lib/demo-data";

const isBreak = (p: Period) => !p.teacher && /break|close/i.test(p.subject);

// One school day's periods, with breaks shown as quiet dividers.
export function TimetableDay({ periods }: { periods: Period[] }) {
  return (
    <ol className="overflow-hidden rounded-[18px] border border-line bg-white">
      {periods.map((p) => (
        <li
          key={p.start}
          className={`flex items-center gap-3 border-t border-line px-4 first:border-t-0 md:px-5 ${
            isBreak(p) ? "bg-ground py-2 text-sm text-muted" : "py-3"
          }`}
        >
          <span className="w-24 shrink-0 text-sm text-muted tabular-nums">
            {p.start}–{p.end}
          </span>
          <span className={`flex-1 ${isBreak(p) ? "" : "font-semibold"}`}>{p.subject}</span>
          {p.teacher && <span className="hidden text-sm text-muted sm:inline">{p.teacher}</span>}
        </li>
      ))}
    </ol>
  );
}
