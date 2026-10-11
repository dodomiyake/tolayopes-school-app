import type { Metadata } from "next";
import { Dashboard } from "./dashboard";

export const metadata: Metadata = { title: "Staff dashboard" };

export default function AdminPage() {
  return <Dashboard />;
}
