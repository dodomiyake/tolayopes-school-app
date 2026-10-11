"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatNaira, parseNairaToKobo } from "@/lib/money";
import { ChildSwitcher, useChild } from "../../child-context";

const banks = [
  "Access Bank", "Ecobank", "Fidelity Bank", "First Bank", "FCMB", "GTBank", "Keystone Bank", "Polaris Bank",
  "Stanbic IBTC", "Sterling Bank", "UBA", "Union Bank", "Wema Bank", "Zenith Bank", "Other",
];

const field = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-base";
const label = "flex flex-col gap-1.5 text-sm font-semibold";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TellerForm() {
  const { child, addTeller } = useChild();
  const balance = child.bill.reduce((s, l) => s + l.amountKobo - l.paidKobo, 0);
  const [amount, setAmount] = useState(balance > 0 ? (balance / 100).toLocaleString("en-NG") : "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sentFor, setSentFor] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // Today's date depends on the parent's device, so it is filled in after the page loads.
  useEffect(() => {
    const input = dateRef.current;
    if (!input) return;
    input.max = today();
    if (!input.value) input.value = today();
  }, [sentFor]);

  // Free the last preview when the page closes.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function choose(f: File | null) {
    setFile(f);
    setPreview(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  }

  const kobo = parseNairaToKobo(amount);
  const amountError = amount.trim() !== "" && kobo === null ? "Enter the amount in naira, for example 45,000" : null;

  function send(form: FormData) {
    if (kobo === null || !file) return;
    addTeller({
      amountKobo: kobo,
      bank: String(form.get("bank")),
      paidOn: String(form.get("paidOn")),
      reference: String(form.get("reference") ?? ""),
      fileName: file.name,
    });
    setSentFor(child.id);
  }

  if (sentFor === child.id) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-5 md:max-w-xl">
        <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-brand">Teller sent</span>
        <h1 className="text-2xl font-extrabold">Thank you</h1>
        <p className="text-muted">
          The bursar will check your teller against the school&apos;s bank account. Once it is confirmed, the official
          receipt appears on {child.firstName}&apos;s fees page.
        </p>
        <Link href="/parent/fees" className="flex h-12 items-center rounded-xl bg-brand px-5 font-bold text-white">
          Back to fees
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Upload bank teller</h1>
          <p className="text-sm text-muted">
            For {child.firstName} {child.lastName} · {child.className} · balance {formatNaira(balance)}
          </p>
        </div>
        <ChildSwitcher />
      </div>

      <form
        action={send}
        className="grid gap-4 rounded-2xl border border-line bg-white p-4 md:grid-cols-2 md:p-5 lg:max-w-3xl"
      >
        <label className={label}>
          Amount paid (₦)
          <input
            name="amount"
            inputMode="decimal"
            autoComplete="off"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={amountError ? true : undefined}
            aria-describedby="amount-hint"
            className={`${field} ${amountError ? "border-alert" : ""}`}
          />
          <span id="amount-hint" className={`text-xs font-normal ${amountError ? "font-semibold text-alert" : "text-muted"}`}>
            {amountError ??
              (kobo !== null && kobo > balance
                ? "This is more than the balance. The extra counts towards next term."
                : "Exactly as written on the teller.")}
          </span>
        </label>

        <label className={label}>
          Bank
          <select name="bank" required defaultValue="" className={field}>
            <option value="" disabled>
              Choose the bank
            </option>
            {banks.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>

        <label className={label}>
          Date paid
          <input ref={dateRef} name="paidOn" type="date" required className={field} />
        </label>

        <label className={label}>
          Teller or transaction number
          <input name="reference" autoComplete="off" placeholder="Optional" className={field} />
        </label>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-sm font-semibold" id="photo-label">
            Photo of the teller
          </span>
          <label
            className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed p-4 text-center ${
              file ? "border-brand-600 bg-lime-50" : "border-line-strong bg-ground"
            }`}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview of the parent's own photo
              <img src={preview} alt="Your teller" className="max-h-48 rounded-lg object-contain" />
            ) : null}
            <span className="text-sm font-bold text-brand">
              {file ? `${file.name} · tap to change` : "Take a photo or choose a file"}
            </span>
            <span className="text-xs text-muted">A clear photo where the amount and date can be read. JPG, PNG or PDF.</span>
            <input
              type="file"
              name="photo"
              accept="image/*,application/pdf"
              required
              aria-labelledby="photo-label"
              onChange={(e) => choose(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>
        </div>

        <button
          disabled={kobo === null || !file}
          className="h-13 rounded-2xl bg-brand text-base font-bold text-white hover:bg-brand-600 disabled:bg-line disabled:text-muted md:col-span-2"
        >
          Send teller to the bursar
        </button>
      </form>
    </div>
  );
}
