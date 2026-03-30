import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { logout } from "@/actions/auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teacher",
  description: "Révise avec tes cours",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession().catch(() => null);

  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        {session && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
              <nav className="flex items-center gap-1">
                {session.type === "parent" ? (
                  <>
                    <Link href="/" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Mes enfants
                    </Link>
                    <Link href="/programmes" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Programmes
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/children/${session.id}`} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Mes séquences
                    </Link>
                    <Link href="/programmes" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Programmes
                    </Link>
                  </>
                )}
              </nav>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{session.firstName}</span>
                </span>
                <form action={logout}>
                  <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Déconnexion
                  </button>
                </form>
              </div>
            </div>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
