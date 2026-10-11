import { demoAdmin } from "@/lib/demo-data";
import { formatNaira } from "@/lib/money";

export function TellerTable({ confirmed, onConfirm }: { confirmed: Set<string>; onConfirm: (id: string) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="font-bold">Bank tellers waiting for confirmation</h2>
        <span className="text-sm text-muted">Confirming issues the official receipt</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-lime-50 text-left text-xs font-bold text-muted">
            <th scope="col" className="px-5 py-2.5">Pupil</th>
            <th scope="col" className="px-3 py-2.5">Class</th>
            <th scope="col" className="px-3 py-2.5">Amount</th>
            <th scope="col" className="px-3 py-2.5">Bank</th>
            <th scope="col" className="w-36 px-5 py-2.5"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {demoAdmin.tellers.map((t) => (
            <tr key={t.id} className="border-t border-line">
              <td className="px-5 py-2.5 font-semibold">{t.pupil}</td>
              <td className="px-3 py-2.5 text-muted">{t.className}</td>
              <td className="px-3 py-2.5 font-bold">{formatNaira(t.amountKobo)}</td>
              <td className="px-3 py-2.5 text-muted">{t.bank}</td>
              <td className="px-5 py-2">
                {confirmed.has(t.id) ? (
                  <span className="flex h-9.5 items-center justify-center rounded-xl bg-lime-100 text-[13px] font-bold text-brand">
                    Receipt issued
                  </span>
                ) : (
                  <button
                    onClick={() => onConfirm(t.id)}
                    aria-label={`Confirm ${formatNaira(t.amountKobo)} teller for ${t.pupil}`}
                    className="h-9.5 w-full rounded-xl bg-brand text-[13px] font-bold text-white hover:bg-brand-600"
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
