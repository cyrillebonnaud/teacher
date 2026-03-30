"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Programme = {
  id: string;
  level: string;
  subject: string;
  title: string;
  content: string;
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  );
}

function getSnippet(content: string, query: string, maxLen = 180): string {
  if (!query.trim()) return content.substring(0, maxLen) + (content.length > maxLen ? "…" : "");
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.substring(0, maxLen) + (content.length > maxLen ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + query.length + 120);
  return (start > 0 ? "…" : "") + content.substring(start, end) + (end < content.length ? "…" : "");
}

export default function ProgrammesClient({
  levels,
  subjects,
  programmes,
  currentLevel,
  currentSubject,
  currentQuery,
}: {
  levels: string[];
  subjects: string[];
  programmes: Programme[];
  currentLevel: string;
  currentSubject: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentQuery);

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams({
      level: currentLevel,
      subject: currentSubject,
      q: currentQuery,
      ...params,
    });
    // Remove empty params
    for (const [k, v] of Array.from(sp.entries())) {
      if (!v) sp.delete(k);
    }
    router.push("/programmes?" + sp.toString());
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: searchInput, level: currentLevel, subject: currentSubject });
  }

  return (
    <div className="space-y-5">
      {/* Level tabs */}
      <div className="flex gap-2">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => navigate({ level: l, subject: "", q: searchInput })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              l === currentLevel
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      {subjects.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ subject: "" })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !currentSubject
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            Toutes
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => navigate({ subject: s })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                s === currentSubject
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher dans les programmes…"
          className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg"
        >
          Chercher
        </button>
        {currentQuery && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); navigate({ q: "" }); }}
            className="px-3 py-2.5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
          >
            ×
          </button>
        )}
      </form>

      {/* Results */}
      {programmes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {currentQuery
              ? `Aucun résultat pour "${currentQuery}"`
              : "Aucun programme pour ce niveau / cette matière"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {programmes.map((p) => {
            const snippet = getSnippet(p.content, currentQuery);
            return (
              <Link
                key={p.id}
                href={`/programmes/${p.id}${currentQuery ? `?q=${encodeURIComponent(currentQuery)}` : ""}`}
                className="block bg-white rounded-xl border border-gray-200 px-4 py-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">
                    {highlight(p.title, currentQuery)}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{p.level}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentQuery ? highlight(snippet, currentQuery) : snippet}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
