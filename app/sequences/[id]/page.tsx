import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DeleteSequenceButton from "./delete-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SequenceDetailPage({ params }: Props) {
  const { id } = await params;

  const sequence = await prisma.sequence.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      evaluations: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!sequence) notFound();

  const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Expert" };
  const LEVEL_COLORS: Record<number, string> = {
    1: "text-green-600",
    2: "text-orange-500",
    3: "text-red-600",
  };

  function starRating(score: number | null, total = 10): string {
    if (score === null) return "";
    const stars = Math.round((score / total) * 5);
    return "⭐".repeat(stars) + "☆".repeat(5 - stars);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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

      {/* Actions */}
      {sequence.documents.length > 0 && (
        <div className="flex gap-3 mb-6">
          <Link
            href={`/sequences/${sequence.id}/qcm`}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold text-center rounded-xl"
          >
            🎯 Générer un QCM
          </Link>
          <Link
            href={`/chat?sequenceId=${sequence.id}`}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold text-center rounded-xl"
          >
            💬 Poser une question
          </Link>
        </div>
      )}

      {/* Documents */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Documents ({sequence.documents.length})
          </h2>
          <Link
            href={`/sequences/${sequence.id}/upload`}
            className="text-sm font-semibold text-blue-600"
          >
            + Ajouter
          </Link>
        </div>

        {sequence.documents.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
            <p className="text-gray-400 text-sm mb-3">Aucun document uploadé</p>
            <Link
              href={`/sequences/${sequence.id}/upload`}
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
            >
              Uploader un document
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {sequence.documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/sequences/${sequence.id}/documents/${doc.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">
                  {doc.mimeType === "application/pdf" ? "📄" : "📷"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                  <p className="text-xs text-gray-400">
                    {doc.rawText.length > 0
                      ? `${doc.rawText.length} caractères extraits`
                      : "Texte non extrait"}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Evaluations */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Évaluations ({sequence.evaluations.length})
        </h2>

        {sequence.evaluations.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucun QCM réalisé pour l&apos;instant
          </p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {sequence.evaluations.map((ev) => (
              <Link
                key={ev.id}
                href={`/sequences/${sequence.id}/qcm/${ev.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-sm font-bold ${LEVEL_COLORS[ev.level]}`}>
                  N{ev.level}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {LEVEL_LABELS[ev.level]}
                    {ev.submittedAt ? ` — ${ev.score ?? 0}/10` : " — En cours"}
                  </p>
                  {ev.submittedAt && ev.score !== null && (
                    <p className="text-xs">{starRating(ev.score)}</p>
                  )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
