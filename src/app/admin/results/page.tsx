import type { Metadata } from "next";
import { Results } from "./results";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
  return <Results />;
}
