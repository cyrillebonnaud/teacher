"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isSequences =
    pathname === "/sequences" ||
    pathname === "/" ||
    pathname.startsWith("/sequences/");
  const isChat = pathname.startsWith("/chat");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex h-16 z-50">
      <Link
        href="/sequences"
        className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
          isSequences ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSequences ? "#2563eb" : "#9ca3af"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        Séquences
      </Link>
      <Link
        href="/chat"
        className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
          isChat ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isChat ? "#2563eb" : "#9ca3af"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Chat
      </Link>
    </nav>
  );
}
