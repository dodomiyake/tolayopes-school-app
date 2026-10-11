import type { Metadata } from "next";
import { ParentHome } from "./parent-home";

export const metadata: Metadata = { title: "Home" };

export default function ParentPage() {
  return <ParentHome />;
}
