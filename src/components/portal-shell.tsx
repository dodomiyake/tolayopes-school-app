"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Crest } from "./crest";
import { school } from "@/lib/school";

export type NavItem = { href: string; label: string; icon: ReactNode };

// Shared frame for the parent, student and teacher portals: a green header with the crest,
// inline navigation from tablet width up, and a bottom tab bar on phones.
export function PortalShell({
  nav,
  portal,
  children,
}: {
  nav: NavItem[];
  portal: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-brand">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-[72px] md:px-8">
          <Crest size={40} />
          <div className="flex flex-1 flex-col leading-tight">
            <span className="text-base font-extrabold text-white">{school.shortName}</span>
            <span className="text-xs text-lime-200">{portal}</span>
          </div>
          <nav aria-label="Main" className="hidden gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex h-11 items-center rounded-xl px-4 text-sm ${
                  isActive(item.href) ? "bg-sun font-bold text-ink" : "font-semibold text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-28 md:px-8 md:pt-8 md:pb-12">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 grid border-t border-line bg-white px-2 pt-1.5 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden"
        style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
              isActive(item.href) ? "font-bold text-brand" : "font-semibold text-muted"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
