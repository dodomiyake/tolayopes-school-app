"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Items marked soon are later MVP screens.
const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/attendance", label: "Attendance", soon: true },
  { href: "/admin/fees", label: "Fees and receipts" },
  { href: "/admin/results", label: "Results", soon: true },
  { href: "/admin/classes", label: "Classes and subjects", soon: true },
  { href: "/admin/settings", label: "Settings", soon: true },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Staff" className="flex flex-col gap-1">
      {items.map((item) =>
        item.soon ? (
          <span
            key={item.href}
            aria-disabled="true"
            className="flex h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold text-white/60"
          >
            {item.label}
            <span className="text-[10px] font-bold tracking-wide text-lime-200/80 uppercase">Soon</span>
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={`flex h-11 items-center rounded-xl px-3 text-sm ${
              pathname === item.href ? "bg-sun font-bold text-ink" : "font-semibold text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
