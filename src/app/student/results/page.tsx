import type { Metadata } from "next";
import { ReportCard } from "@/components/report-card";
import { demoStudent, demoStudentReport } from "@/lib/demo-data";

export const metadata: Metadata = { title: "My results" };

export default function StudentResultsPage() {
  return (
    <ReportCard
      report={{ ...demoStudentReport, name: `${demoStudent.firstName} ${demoStudent.lastName}`, className: demoStudent.className }}
    />
  );
}
