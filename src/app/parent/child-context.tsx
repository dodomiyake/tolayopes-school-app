"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { demoChildren, type Child } from "@/lib/demo-data";

export type SentTeller = {
  id: string;
  amountKobo: number;
  bank: string;
  paidOn: string;
  reference: string;
  fileName: string;
};

type ChildState = {
  children: Child[];
  child: Child;
  select: (id: string) => void;
  tellers: SentTeller[];
  addTeller: (t: Omit<SentTeller, "id">) => void;
};

const ChildContext = createContext<ChildState | null>(null);

// Keeps the chosen child as the parent moves between Home, Fees and Results.
export function ChildProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(demoChildren[0].id);
  const [sent, setSent] = useState<Record<string, SentTeller[]>>({});
  const child = demoChildren.find((c) => c.id === selectedId) ?? demoChildren[0];
  const tellers = sent[child.id] ?? [];
  const addTeller = (t: Omit<SentTeller, "id">) =>
    setSent((s) => ({ ...s, [child.id]: [{ ...t, id: `${child.id}-${tellers.length + 1}` }, ...tellers] }));
  return (
    <ChildContext value={{ children: demoChildren, child, select: setSelectedId, tellers, addTeller }}>
      {children}
    </ChildContext>
  );
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error("useChild must be used inside ChildProvider");
  return ctx;
}

export function ChildSwitcher() {
  const { children, child, select } = useChild();
  return (
    <div role="tablist" aria-label="Your children" className="flex flex-wrap gap-2.5">
      {children.map((c) => {
        const on = c.id === child.id;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={on}
            onClick={() => select(c.id)}
            className={`flex min-h-13 flex-col items-start justify-center rounded-2xl border-[1.5px] px-5 py-2 ${
              on ? "border-brand bg-lime-100 text-brand" : "border-line-strong bg-white text-ink"
            }`}
          >
            <span className="text-[15px] font-bold">{c.firstName}</span>
            <span className="text-xs opacity-80">{c.className}</span>
          </button>
        );
      })}
    </div>
  );
}
