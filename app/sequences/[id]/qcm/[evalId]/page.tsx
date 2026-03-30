export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { type Question } from "@/lib/prompts";
import QcmPlayer from "./qcm-player";

interface Props {
  params: Promise<{ id: string; evalId: string }>;
}

const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };

export default async function QcmEvalPage({ params }: Props) {
  const { id, evalId } = await params;

  const { data: evaluation } = await supabase.from("evaluations").select().eq("id", evalId).single();
  if (!evaluation || evaluation.sequence_id !== id) notFound();

  const { data: sequence } = await supabase.from("sequences").select().eq("id", id).single();
  if (!sequence) notFound();

  const questions = JSON.parse(evaluation.questions) as Question[];
  const savedAnswers = JSON.parse(evaluation.answers) as Record<string, number>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/sequences/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Quiz — {LEVEL_LABELS[evaluation.level]}
          </h1>
          <p className="text-sm text-gray-500">{sequence.emoji} {sequence.name}</p>
        </div>
      </div>

      <QcmPlayer
        evalId={evalId}
        sequenceId={id}
        level={evaluation.level}
        questions={questions}
        savedAnswers={savedAnswers}
        isSubmitted={!!evaluation.submitted_at}
        savedScore={evaluation.score}
        helpMode={!!evaluation.help_mode}
      />
    </div>
  );
}
