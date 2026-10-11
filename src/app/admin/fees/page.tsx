import type { Metadata } from "next";
import { Fees } from "./fees";

export const metadata: Metadata = { title: "Fees and receipts" };

export default function FeesPage() {
  return <Fees />;
}
