export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DeleteSequenceButton from "./delete-button";
import DescriptionEditor from "./description-editor";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

interface Evaluation {
  id: string;
  level: number;
  questions: string;
  score: number | null;
  submitted_at: string | null;
}

const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };
const LEVEL_COLORS: Record<number, string> = {
  1: "text-green-600",
  2: "text-blue-500",
  3: "text-orange-500",
  4: "text-gray-700",
};
const BAR_COLORS: Record<number, string> = {
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-orange-500",
  4: "bg-gray-700",
};

function starRating(score: number | null, total = 10): string {
  if (score === null) return "";
  const pct = Math.max(0, score) / total;
  const stars = Math.round(pct * 5);
  return "⭐".repeat(stars) + "☆".repeat(5 - stars);
}

export default async function SequenceDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const { data: sequence } = await supabase
    .from("sequences")
    .select("*, documents(*), evaluations(*)")
    .eq("id", id)
    .order("created_at", { ascending: false, referencedTable: "evaluations" })
    .single();

  if (!sequence) notFound();

  const evaluations = sequence.evaluations as Evaluation[];
  const submitted = evaluations.filter((e) => e.submitted_at);

  // Progression chart data: best score per level
  const bestByLevel: Record<number, { score: number; total: number }> = {};
  for (const ev of submitted) {
    const qs = JSON.parse(ev.questions);
    const total = qs.length;
    const score = ev.score ?? 0;
    const pct = total > 0 ? score / total : 0;
    const prev = bestByLevel[ev.level];
    if (!prev || pct > prev.score / prev.total) {
      bestByLevel[ev.level] = { score, total };
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/sequences" className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{sequence.emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{sequence.name}</h1>
            <p className="text-sm text-gray-500">{sequence.subject}</p>
          </div>
        </div>
        <DeleteSequenceButton sequenceId={sequence.id} />
      </div>

      {/* Description */}
      <DescriptionEditor sequenceId={sequence.id} initialTopic={sequence.topic} />

      {/* Error banner */}
      {error === "qcm" && (
        <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          Quiz non disponible pour l&apos;instant. Réessaie depuis le bouton ci-dessous.
        </div>
      )}

      {/* Progression chart */}
      {submitted.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Progression
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {/* Stats row */}
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{submitted.length}</p>
                <p className="text-xs text-gray-500">quiz terminés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {submitted.length > 0
                    ? Math.round(
                        submitted.reduce((acc, ev) => {
                          const total = JSON.parse(ev.questions).length;
                          return acc + (Math.max(0, ev.score ?? 0) / total) * 100;
                        }, 0) / submitted.length
                      )
                    : 0}%
                </p>
                <p className="text-xs text-gray-500">moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(bestByLevel).length}/4
                </p>
                <p className="text-xs text-gray-500">niveaux tentés</p>
              </div>
            </div>

            {/* Best score per level bars */}
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4].map((lvl) => {
                const best = bestByLevel[lvl];
                const pct = best ? Math.max(0, Math.round((best.score / best.total) * 100)) : 0;
                return (
                  <div key={lvl} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-16 ${LEVEL_COLORS[lvl]}`}>
                      {LEVEL_LABELS[lvl]}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      {best ? (
                        <div
                          className={`h-full rounded-full transition-all ${BAR_COLORS[lvl]}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-xs text-gray-300">—</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-12 text-right">
                      {best ? `${pct}%` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Générer quiz */}
      <Link
        href={`/sequences/${sequence.id}/qcm`}
        className="block w-full py-3 bg-blue-600 text-white font-semibold text-center rounded-xl mb-6"
      >
        🎯 Générer un quiz
      </Link>

      {/* Evaluations */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Historique ({evaluations.length})
        </h2>

        {evaluations.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucun quiz réalisé pour l&apos;instant
          </p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {evaluations.map((ev) => {
              const qs = JSON.parse(ev.questions as string);
              return (
                <Link
                  key={ev.id}
                  href={`/sequences/${sequence.id}/qcm/${ev.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className={`text-sm font-bold ${LEVEL_COLORS[ev.level] ?? "text-gray-600"}`}>
                    N{ev.level}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {LEVEL_LABELS[ev.level] ?? `Niveau ${ev.level}`}
                      {ev.submitted_at ? ` — ${ev.score ?? 0}/${qs.length}` : " — En cours"}
                    </p>
                    {ev.submitted_at && ev.score !== null && (
                      <p className="text-xs">{starRating(ev.score, qs.length)}</p>
                    )}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
