import type { Metadata } from "next";
import { TellerForm } from "./teller-form";

export const metadata: Metadata = { title: "Upload bank teller" };

export default function TellerPage() {
  return <TellerForm />;
}
