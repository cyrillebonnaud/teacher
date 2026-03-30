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

export default async function SequenceDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const { data: sequence } = await supabase
    .from("sequences")
    .select("*, documents(*), evaluations(*)")
    .eq("id", id)
    .order("created_at", { ascending: false, referencedTable: "documents" })
    .order("created_at", { ascending: false, referencedTable: "evaluations" })
    .single();

  if (!sequence) notFound();

  const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };
  const LEVEL_COLORS: Record<number, string> = {
    1: "text-green-600",
    2: "text-blue-500",
    3: "text-orange-500",
    4: "text-gray-700",
  };

  function starRating(score: number | null, total = 10): string {
    if (score === null) return "";
    const stars = Math.round((score / total) * 5);
    return "⭐".repeat(stars) + "☆".repeat(5 - stars);
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

      {/* Documents */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Documents ({(sequence.documents as unknown[]).length})
        </h2>

        {(sequence.documents as unknown[]).length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
            <p className="text-gray-400 text-sm mb-3">Aucun document uploadé</p>
            <Link
              href={`/sequences/${sequence.id}/upload`}
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
            >
              Ajouter un document
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {(sequence.documents as {id:string; filename:string; raw_text:string; mime_type:string}[]).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/sequences/${sequence.id}/documents/${doc.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">
                    {doc.mime_type === "application/pdf" ? "📄" : "📷"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                    <p className="text-xs text-gray-400">
                      {doc.raw_text.length > 0
                        ? `${doc.raw_text.length} caractères extraits`
                        : "Texte non extrait"}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
            <Link
              href={`/sequences/${sequence.id}/upload`}
              className="mt-3 block text-center text-sm font-semibold text-blue-600 py-2"
            >
              + Ajouter un document
            </Link>
          </>
        )}
      </section>

      {/* Générer quiz */}
      {((sequence.documents as unknown[]).length > 0 || sequence.topic) && (
        <Link
          href={`/sequences/${sequence.id}/qcm`}
          className="block w-full py-3 bg-blue-600 text-white font-semibold text-center rounded-xl mb-6"
        >
          🎯 Générer un quiz
        </Link>
      )}

      {/* Evaluations */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Évaluations ({(sequence.evaluations as unknown[]).length})
        </h2>

        {(sequence.evaluations as unknown[]).length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucun quiz réalisé pour l&apos;instant
          </p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {(sequence.evaluations as {id:string; level:number; questions:string; score:number|null; submitted_at:string|null}[]).map((ev) => {
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
                      <p className="text-xs">{starRating(ev.score)}</p>
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
