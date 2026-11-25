import type { Metadata } from "next";
import "./globals.css";

const description = "A fictional construction company website created as a web development portfolio demo.";

export const metadata: Metadata = {
  title: "Stonebridge Construction | Portfolio Demo",
  description,
  openGraph: { title: "Stonebridge Construction", description, type: "website" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
