export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import ProgrammesClient from "./programmes-client";

const SUBJECT_EMOJI: Record<string, string> = {
  "Mathématiques": "📐",
  "Français": "📖",
  "Histoire-Géographie": "🌍",
  "Sciences de la Vie et de la Terre": "🔬",
  "Physique-Chimie": "⚗️",
  "Anglais": "🗣️",
  "Arts Plastiques": "🎨",
  "Musique": "🎵",
  "EPS": "⚽",
  "Technologie": "💻",
  "Latin": "🏛️",
  "Espagnol": "🌞",
  "Histoire des arts": "🖼️",
};

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const currentSubject = params.subject ?? "";

  const session = await getSession().catch(() => null);
  if (!session) redirect("/login");

  const { data: all } = await supabase
    .from("programmes")
    .select("id, subject, title, content")
    .eq("level", "5e")
    .order("subject", { ascending: true });

  const programmes = (all ?? []).map((p) => ({
    ...p,
    emoji: SUBJECT_EMOJI[p.subject] ?? "📚",
  }));

  // Filter by search query
  const filtered = programmes.filter((p) => {
    const matchSubject = !currentSubject || p.subject === currentSubject;
    if (!matchSubject) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Programmes 5e</h1>
      <ProgrammesClient
        programmes={filtered}
        allProgrammes={programmes}
        currentQuery={query}
        currentSubject={currentSubject}
      />
    </div>
  );
}
