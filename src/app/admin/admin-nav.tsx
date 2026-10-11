"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/fees", label: "Fees and receipts" },
  { href: "/admin/results", label: "Results" },
  { href: "/admin/classes", label: "Classes and subjects" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Staff" className="flex flex-col gap-1">
      {items.map((item) => (
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
      ))}
    </nav>
  );
}
