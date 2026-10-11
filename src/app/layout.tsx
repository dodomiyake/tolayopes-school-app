import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { school } from "@/lib/school";

export const metadata: Metadata = {
  title: { default: school.shortName, template: `%s · ${school.shortName}` },
  description: `Attendance, fees and results for ${school.name}.`,
  icons: { icon: "/crest.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b4d22",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
