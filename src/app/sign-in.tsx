"use client";

import Link from "next/link";
import { useState } from "react";
import { MonitorIcon } from "@/components/icons";

type Role = "parent" | "teacher" | "staff";

const roles: { id: Role; label: string; href: string }[] = [
  { id: "parent", label: "Parent", href: "/parent" },
  { id: "teacher", label: "Teacher", href: "/teacher" },
  { id: "staff", label: "Staff", href: "/admin" },
];

// Until Supabase is connected, "Send code" goes straight to the chosen portal.
export function SignIn() {
  const [role, setRole] = useState<Role>("parent");
  const current = roles.find((r) => r.id === role)!;
  const isStaff = role === "staff";

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-muted">I am a</legend>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.id === role}
              onClick={() => setRole(r.id)}
              className={`h-12 rounded-xl border-[1.5px] text-sm ${
                r.id === role
                  ? "border-brand bg-lime-100 font-bold text-brand"
                  : "border-line-strong bg-white font-semibold text-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      {isStaff ? (
        <>
          {/* The staff portal is desktop-only: phones and tablets get a pointer to a computer. */}
          <div className="flex gap-2.5 rounded-xl border border-sun-300 bg-sun-50 p-3.5 lg:hidden">
            <MonitorIcon size={20} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-sm leading-relaxed">
              The staff portal opens on a laptop or desktop computer only. Please sign in there.
            </p>
          </div>
          <div className="hidden flex-col gap-4 lg:flex">
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted">
              Staff email
              <input
                type="email"
                autoComplete="username"
                placeholder="bursar@tolayopes.school"
                className="h-13 rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal text-ink"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted">
              Password
              <input
                type="password"
                autoComplete="current-password"
                className="h-13 rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal text-ink"
              />
            </label>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-semibold text-muted">
            Phone number
          </label>
          <div className="flex h-13 items-center gap-2.5 rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 focus-within:outline-2 focus-within:outline-lime">
            <span className="font-semibold text-muted">+234</span>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="803 000 0000"
              className="h-11 flex-1 bg-transparent text-base outline-none"
            />
          </div>
          <p className="text-xs text-muted">We&apos;ll text you a 6-digit code. No password needed.</p>
        </div>
      )}

      <Link
        href={current.href}
        className={`h-13 items-center justify-center rounded-2xl bg-brand text-base font-bold text-white hover:bg-brand-600 ${
          isStaff ? "hidden lg:flex" : "flex"
        }`}
      >
        {isStaff ? "Sign in to staff portal" : "Send code"}
      </Link>
    </div>
  );
}
