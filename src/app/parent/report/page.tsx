import type { Metadata } from "next";
import { ReportCard } from "@/components/report-card";
import { demoChildren, demoReport } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Report card" };

export default function ReportCardPage() {
  const child = demoChildren.find((c) => c.id === demoReport.childId)!;
  return <ReportCard report={{ ...demoReport, name: `${child.firstName} ${child.lastName}`, className: child.className }} />;
}
