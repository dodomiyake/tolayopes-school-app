import type { Metadata } from "next";

export const metadata: Metadata = { title: "Scores" };

// Score entry is the next MVP screen; this keeps the nav link honest until then.
export default function ScoresPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-extrabold">Scores</h1>
      <p className="text-muted">CA and exam score entry is coming next.</p>
    </div>
  );
}
