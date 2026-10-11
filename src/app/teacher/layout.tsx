import { ListIcon, ReportIcon, UserIcon } from "@/components/icons";
import { PortalShell } from "@/components/portal-shell";

const nav = [
  { href: "/teacher", label: "Register", icon: <ListIcon /> },
  { href: "/teacher/scores", label: "Scores", icon: <ReportIcon /> },
  { href: "/", label: "Sign out", icon: <UserIcon /> },
];

export default function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  return (
    <PortalShell nav={nav} portal="Teachers">
      {children}
    </PortalShell>
  );
}
