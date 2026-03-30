export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };

export default async function ChildPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  const session = await getSession().catch(() => null);
  if (!session) redirect("/login");

  // Allow parent (must own the child) or the child itself
  let childQuery = supabase
    .from("children")
    .select("id, first_name, level")
    .eq("id", childId);

  if (session.type === "parent") {
    childQuery = childQuery.eq("parent_id", session.id);
  } else if (session.type === "child" && session.id !== childId) {
    notFound();
  }

  const { data: child } = await childQuery.single();
  if (!child) notFound();

  const { data: sequences } = await supabase
    .from("sequences")
    .select("id, name, subject, emoji, evaluations(id, score, level, submitted_at)")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Mes enfants
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
          {child.first_name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{child.first_name}</h1>
          <p className="text-sm text-gray-500">{child.level}</p>
        </div>
        <Link
          href="/sequences/new"
          className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
        >
          + Nouveau quiz
        </Link>
      </div>

      {(sequences ?? []).length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 text-lg mb-2">Aucune séquence pour l&apos;instant</p>
          <p className="text-gray-400 text-sm mb-6">
            Crée une première séquence pour {child.first_name}
          </p>
          <Link
            href="/sequences/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Créer une séquence
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {(sequences ?? []).map((seq) => {
            const evals = (seq.evaluations as { id: string; score: number | null; level: number; submitted_at: string | null }[]) ?? [];
            const submitted = evals.filter((e) => e.submitted_at);
            const bestScore = submitted.length > 0 ? Math.max(...submitted.map((e) => e.score ?? 0)) : null;

            return (
              <Link
                key={seq.id}
                href={`/sequences/${seq.id}`}
                className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-4 hover:border-blue-300 transition-colors"
              >
                <span className="text-3xl">{seq.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{seq.name}</p>
                  <p className="text-sm text-gray-500">{seq.subject}</p>
                </div>
                <div className="text-right text-xs text-gray-400 shrink-0">
                  <p>{evals.length} quiz</p>
                  {bestScore !== null && (
                    <p className="text-blue-600 font-medium">meilleur: {bestScore}</p>
                  )}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
