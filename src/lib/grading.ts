export type GradeBand = { grade: string; min: number; max: number; remark: string };

// Default scale until the school confirms its own (matches supabase/seed.sql).
export const defaultBands: GradeBand[] = [
  { grade: "A", min: 75, max: 100, remark: "Excellent" },
  { grade: "B", min: 65, max: 74.99, remark: "Very good" },
  { grade: "C", min: 55, max: 64.99, remark: "Good" },
  { grade: "D", min: 45, max: 54.99, remark: "Fair" },
  { grade: "E", min: 0, max: 44.99, remark: "Needs improvement" },
];

export function gradeFor(total: number, bands: GradeBand[] = defaultBands): GradeBand {
  const band = bands.find((b) => total >= b.min && total <= b.max);
  if (!band) throw new Error(`No grade band covers a total of ${total}`);
  return band;
}

export function average(totals: number[]): number {
  if (totals.length === 0) return 0;
  return Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10;
}

// Class positions with ties sharing a place: 90, 85, 85, 80 -> 1st, 2nd, 2nd, 4th.
export function positions<T extends { id: string; score: number }>(rows: T[]): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b.score - a.score);
  const result = new Map<string, number>();
  sorted.forEach((row, i) => {
    const prev = sorted[i - 1];
    result.set(row.id, prev && prev.score === row.score ? result.get(prev.id)! : i + 1);
  });
  return result;
}

export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

// Checks one typed score against its maximum. Blank is allowed (not yet entered).
export function scoreError(value: string, max: number): string | null {
  const v = value.trim();
  if (v === "") return null;
  if (!/^\d+(\.5)?$/.test(v)) return "Use a whole number or .5";
  if (Number(v) > max) return `Max is ${max}`;
  return null;
}
