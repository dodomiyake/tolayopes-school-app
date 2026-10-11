// Amounts are stored in kobo (1 naira = 100 kobo) so sums never drift.
const naira = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

export function formatNaira(kobo: number): string {
  return `₦${naira.format(Math.round(kobo / 100))}`;
}

// Short form for dashboards: ₦31.2m, ₦850k.
export function formatNairaShort(kobo: number): string {
  const n = kobo / 100;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1_000)}k`;
  return formatNaira(kobo);
}

export function paidPercent(billedKobo: number, paidKobo: number): number {
  if (billedKobo <= 0) return 100;
  return Math.min(100, Math.round((paidKobo / billedKobo) * 100));
}

// Reads an amount a parent typed ("45,000", "₦45000", "45000.50") into kobo. Returns null if it isn't a positive amount.
export function parseNairaToKobo(input: string): number | null {
  const cleaned = input.replace(/[₦,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const kobo = Math.round(Number(cleaned) * 100);
  return kobo > 0 ? kobo : null;
}
