import { CalendarIcon, HomeIcon, ReportIcon, UserIcon } from "@/components/icons";
import { PortalShell } from "@/components/portal-shell";

const nav = [
  { href: "/student", label: "Home", icon: <HomeIcon /> },
  { href: "/student/timetable", label: "Timetable", icon: <CalendarIcon /> },
  { href: "/student/results", label: "Results", icon: <ReportIcon /> },
  { href: "/", label: "Sign out", icon: <UserIcon /> },
];

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return (
    <PortalShell nav={nav} portal="Students">
      {children}
    </PortalShell>
  );
}
