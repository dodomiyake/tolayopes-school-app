import type { Metadata } from "next";
import { Register } from "./register";

export const metadata: Metadata = { title: "Attendance register" };

export default function TeacherPage() {
  return <Register />;
}
