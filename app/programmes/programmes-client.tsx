"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Programme = {
  id: string;
  subject: string;
  title: string;
  content: string;
  emoji: string;
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
    ) : part
  );
}

function getSnippet(content: string, query: string, maxLen = 120): string {
  if (!query.trim()) return content.substring(0, maxLen) + (content.length > maxLen ? "…" : "");
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.substring(0, maxLen) + (content.length > maxLen ? "…" : "");
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 80);
  return (start > 0 ? "…" : "") + content.substring(start, end) + (end < content.length ? "…" : "");
}

export default function ProgrammesClient({
  programmes,
  allProgrammes,
  currentQuery,
  currentSubject,
}: {
  programmes: Programme[];
  allProgrammes: Programme[];
  currentQuery: string;
  currentSubject: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentQuery);

  function navigate(params: { q?: string; subject?: string }) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.subject) sp.set("subject", params.subject);
    router.push("/programmes" + (sp.toString() ? "?" + sp.toString() : ""));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: searchInput, subject: currentSubject });
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher dans les programmes…"
          className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
        />
        <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg">
          Chercher
        </button>
        {(currentQuery || currentSubject) && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); navigate({}); }}
            className="px-3 py-2.5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
          >
            ×
          </button>
        )}
      </form>

      {/* Subject filter pills */}
      {!currentQuery && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate({})}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !currentSubject ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            Tout
          </button>
          {allProgrammes.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate({ subject: p.subject })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                p.subject === currentSubject ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {p.emoji} {p.subject}
            </button>
          ))}
        </div>
      )}

      {/* Cards grid */}
      {programmes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {currentQuery ? `Aucun résultat pour "${currentQuery}"` : "Aucun programme disponible"}
          </p>
        </div>
      ) : currentQuery ? (
        // Search results: list with snippets
        <div className="space-y-2">
          {programmes.map((p) => (
            <Link
              key={p.id}
              href={`/programmes/${p.id}?q=${encodeURIComponent(currentQuery)}`}
              className="block bg-white rounded-xl border border-gray-200 px-4 py-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{p.emoji}</span>
                <p className="font-semibold text-gray-900 text-sm">{highlight(p.title, currentQuery)}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed ml-7">
                {highlight(getSnippet(p.content, currentQuery), currentQuery)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        // No search: subject cards grid
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {programmes.map((p) => (
            <Link
              key={p.id}
              href={`/programmes/${p.id}`}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-sm transition-all gap-2"
            >
              <span className="text-4xl">{p.emoji}</span>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{p.subject}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
