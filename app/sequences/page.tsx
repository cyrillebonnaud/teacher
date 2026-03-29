import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function SequencesPage() {
  const sequences = await prisma.sequence.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { documents: true, evaluations: true } },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes séquences</h1>
        <Link
          href="/sequences/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
        >
          + Nouvelle
        </Link>
      </div>

      {sequences.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 text-lg mb-2">Aucune séquence pour l&apos;instant</p>
          <p className="text-gray-400 text-sm mb-6">
            Crée ta première séquence pour commencer à réviser
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
          {sequences.map((seq) => (
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
                <p>{seq._count.documents} doc{seq._count.documents !== 1 ? "s" : ""}</p>
                <p>{seq._count.evaluations} QCM</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
