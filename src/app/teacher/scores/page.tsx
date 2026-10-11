import type { Metadata } from "next";
import { ScoreSheet } from "./score-sheet";

export const metadata: Metadata = { title: "Scores" };

export default function ScoresPage() {
  return <ScoreSheet />;
}
