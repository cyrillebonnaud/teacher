export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentParent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import ProgrammesClient from "./programmes-client";

const LEVELS = ["6e", "5e", "4e", "3e"];

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; subject?: string; q?: string }>;
}) {
  const params = await searchParams;
  const parent = await getCurrentParent().catch(() => null);
  if (!parent) redirect("/login");

  const level = LEVELS.includes(params.level ?? "") ? params.level! : "5e";
  const subject = params.subject ?? "";
  const query = (params.q ?? "").trim();

  let dbQuery = supabase
    .from("programmes")
    .select("id, level, subject, title, content")
    .eq("level", level)
    .order("subject", { ascending: true });

  if (subject) dbQuery = dbQuery.eq("subject", subject);

  const { data: all } = await dbQuery;

  // Full-text filter (ILIKE in content or title)
  const programmes = (all ?? []).filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q)
    );
  });

  // Get distinct subjects for the current level
  const { data: subjectRows } = await supabase
    .from("programmes")
    .select("subject")
    .eq("level", level)
    .order("subject", { ascending: true });
  const subjects = Array.from(new Set((subjectRows ?? []).map((r) => r.subject)));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Programmes officiels</h1>

      <ProgrammesClient
        levels={LEVELS}
        subjects={subjects}
        programmes={programmes}
        currentLevel={level}
        currentSubject={subject}
        currentQuery={query}
      />
    </div>
  );
}
