import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Teacher",
  description: "Révise avec tes cours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
