export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UploadForm from "./upload-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UploadPage({ params }: Props) {
  const { id } = await params;
  const { data: sequence } = await supabase.from("sequences").select().eq("id", id).single();
  if (!sequence) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/sequences/${id}`}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Uploader un document</h1>
          <p className="text-sm text-gray-500">{sequence.emoji} {sequence.name}</p>
        </div>
      </div>

      <UploadForm sequenceId={id} />
    </div>
  );
}
