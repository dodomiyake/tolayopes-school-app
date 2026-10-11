import type { BillLine } from "@/lib/demo-data";
import { formatNaira } from "@/lib/money";

// The term's bill as a table, with what has been paid against each item.
export function FeeBill({ lines }: { lines: BillLine[] }) {
  const total = lines.reduce((s, l) => s + l.amountKobo, 0);
  const paid = lines.reduce((s, l) => s + l.paidKobo, 0);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
            <th scope="col" className="px-5 py-2.5">Item</th>
            <th scope="col" className="px-5 py-2.5 text-right">Amount</th>
            <th scope="col" className="px-5 py-2.5 text-right">Paid</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => {
            const full = l.paidKobo >= l.amountKobo;
            return (
              <tr key={l.item} className="border-t border-line">
                <td className="px-5 py-3 font-semibold">{l.item}</td>
                <td className="px-5 py-3 text-right">{formatNaira(l.amountKobo)}</td>
                <td className={`px-5 py-3 text-right font-bold ${full ? "text-brand-600" : "text-warn"}`}>
                  {full ? "Paid" : formatNaira(l.paidKobo)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-line-strong font-bold">
            <td className="px-5 py-3">Total</td>
            <td className="px-5 py-3 text-right">{formatNaira(total)}</td>
            <td className="px-5 py-3 text-right">{formatNaira(paid)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
