import Link from "next/link";
import { Crest } from "@/components/crest";
import { MonitorIcon } from "@/components/icons";
import { school } from "@/lib/school";
import { AdminNav } from "./admin-nav";

// The staff portal is desktop-only: below the lg breakpoint it shows a notice instead.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center lg:hidden">
        <Crest size={72} />
        <MonitorIcon size={36} className="text-brand" />
        <h1 className="text-xl font-extrabold">Please use a laptop or desktop</h1>
        <p className="max-w-sm text-muted">
          The {school.shortName} staff portal works on a computer screen only. Parents and teachers can use
          their phones.
        </p>
        <Link href="/" className="mt-2 font-bold text-brand underline">
          Back to sign in
        </Link>
      </div>

      <div className="hidden min-h-dvh lg:flex">
        <aside className="flex w-60 shrink-0 flex-col gap-1 bg-brand px-3.5 py-5">
          <div className="flex items-center gap-2.5 px-1.5 pb-5">
            <Crest size={44} />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-white">{school.shortName}</span>
              <span className="text-xs text-lime-200">Staff portal</span>
            </div>
          </div>
          <AdminNav />
          <Link href="/" className="mt-auto flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-lime-200 hover:bg-white/10">
            Sign out
          </Link>
        </aside>
        <main className="min-w-0 flex-1 px-8 py-7">{children}</main>
      </div>
    </>
  );
}
