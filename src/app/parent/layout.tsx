import { CardIcon, HomeIcon, ReportIcon, UserIcon } from "@/components/icons";
import { PortalShell } from "@/components/portal-shell";
import { ChildProvider } from "./child-context";

const nav = [
  { href: "/parent", label: "Home", icon: <HomeIcon /> },
  { href: "/parent/fees", label: "Fees", icon: <CardIcon /> },
  { href: "/parent/report", label: "Results", icon: <ReportIcon /> },
  { href: "/", label: "Sign out", icon: <UserIcon /> },
];

export default function ParentLayout({ children }: LayoutProps<"/parent">) {
  return (
    <PortalShell nav={nav} portal="Parents">
      <ChildProvider>{children}</ChildProvider>
    </PortalShell>
  );
}
