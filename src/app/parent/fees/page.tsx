import type { Metadata } from "next";
import { ParentFees } from "./parent-fees";

export const metadata: Metadata = { title: "Fees" };

export default function FeesPage() {
  return <ParentFees />;
}
