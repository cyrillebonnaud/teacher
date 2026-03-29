import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DocumentEditor from "./document-editor";

interface Props {
  params: Promise<{ id: string; docId: string }>;
}

export default async function DocumentDetailPage({ params }: Props) {
  const { id, docId } = await params;

  const doc = await prisma.document.findUnique({ where: { id: docId } });
  if (!doc || doc.sequenceId !== id) notFound();

  const sequence = await prisma.sequence.findUnique({ where: { id } });
  if (!sequence) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/sequences/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{doc.filename}</h1>
          <p className="text-sm text-gray-500">{sequence.emoji} {sequence.name}</p>
        </div>
        <span className="text-2xl">
          {doc.mimeType === "application/pdf" ? "📄" : "📷"}
        </span>
      </div>

      {/* Preview */}
      {doc.mimeType !== "application/pdf" && (
        <div className="mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doc.filePath}
            alt={doc.filename}
            className="w-full rounded-xl border border-gray-200 object-contain max-h-64"
          />
        </div>
      )}

      {/* Text editor */}
      <DocumentEditor docId={docId} initialText={doc.rawText} />
    </div>
  );
}
