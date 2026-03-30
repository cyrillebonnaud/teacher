export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentParent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function renderMarkdown(text: string, query?: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  function highlightLine(line: string): React.ReactNode {
    if (!query?.trim()) return line;
    const parts = line.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-200 rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  }

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">
          {highlightLine(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="text-base font-semibold text-gray-800 mt-4 mb-1">
          {highlightLine(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(<li key={i}>{highlightLine(lines[i].slice(2))}</li>);
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc list-inside text-sm text-gray-700 space-y-0.5 ml-2">
          {items}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      nodes.push(
        <p key={i} className="text-sm text-gray-700">
          {highlightLine(line)}
        </p>
      );
    }
    i++;
  }
  return nodes;
}

export default async function ProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const query = sp.q ?? "";

  const parent = await getCurrentParent().catch(() => null);
  if (!parent) redirect("/login");

  const { data: programme } = await supabase
    .from("programmes")
    .select("*")
    .eq("id", id)
    .single();

  if (!programme) notFound();

  const backUrl = `/programmes?level=${programme.level}&subject=${encodeURIComponent(programme.subject)}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={backUrl} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Programmes
        </Link>
      </div>

      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">
          {programme.level}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{programme.title}</h1>
      </div>

      {query && (
        <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
          Termes surlignés : <strong>{query}</strong>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 space-y-1">
        {renderMarkdown(programme.content, query)}
      </div>
    </div>
  );
}
