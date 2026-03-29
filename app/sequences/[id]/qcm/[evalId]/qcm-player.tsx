"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type Question } from "@/lib/prompts";
import QcmQuestion from "@/components/qcm-question";
import { saveAnswer, submitQcm, generateQcm } from "@/actions/evaluations";

interface Props {
  evalId: string;
  sequenceId: string;
  level: number;
  questions: Question[];
  savedAnswers: Record<string, number>;
  isSubmitted: boolean;
  savedScore: number | null;
}

function starRating(score: number, total = 10): string {
  const stars = Math.round((score / total) * 5);
  return "⭐".repeat(stars) + "☆".repeat(5 - stars);
}

export default function QcmPlayer({
  evalId,
  sequenceId,
  level,
  questions,
  savedAnswers,
  isSubmitted,
  savedScore,
}: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>(
    Object.fromEntries(
      Object.entries(savedAnswers).map(([k, v]) => [Number(k), v])
    )
  );
  const [phase, setPhase] = useState<"answering" | "results">(
    isSubmitted ? "results" : "answering"
  );
  const [score, setScore] = useState<number | null>(savedScore);
  const [unanswered, setUnanswered] = useState<number[]>([]);
  const [submitting, startSubmit] = useTransition();
  const [retrying, startRetry] = useTransition();

  async function handleAnswer(questionIdx: number, answerIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionIdx]: answerIdx }));
    setUnanswered((prev) => prev.filter((i) => i !== questionIdx));
    await saveAnswer(evalId, questionIdx, answerIdx);
  }

  function handleSubmit() {
    const missing = questions
      .map((_, i) => i)
      .filter((i) => answers[i] === undefined);
    if (missing.length > 0) {
      setUnanswered(missing);
      document.getElementById(`q-${missing[0]}`)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    startSubmit(async () => {
      const finalScore = await submitQcm(evalId);
      setScore(finalScore);
      setPhase("results");
    });
  }

  function handleRetry(newLevel?: number) {
    const previousQuestions = questions.map((q) => q.question);
    startRetry(async () => {
      await generateQcm(sequenceId, newLevel ?? level, previousQuestions);
    });
  }

  if (phase === "results" && score !== null) {
    const percentage = Math.round((score / questions.length) * 100);
    const nextLevel = level < 3 ? level + 1 : null;

    return (
      <div className="space-y-4 animate-slide-up">
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-8 text-center">
          <p className="text-5xl font-bold text-gray-900 mb-1">
            {score}/{questions.length}
          </p>
          <p className="text-2xl mb-2">{starRating(score, questions.length)}</p>
          <p className="text-gray-500 text-sm">{percentage}% de bonnes réponses</p>
          {percentage === 100 && (
            <p className="mt-3 text-green-600 font-semibold">🎉 Parfait ! Bravo !</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => handleRetry()}
            disabled={retrying}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {retrying ? "Génération…" : "🔄 Recommencer (questions différentes)"}
          </button>
          {nextLevel && (
            <button
              onClick={() => handleRetry(nextLevel)}
              disabled={retrying}
              className="w-full py-3 border-2 border-orange-400 text-orange-600 font-semibold rounded-xl disabled:opacity-50"
            >
              ⬆️ Tenter le niveau {nextLevel}
            </button>
          )}
        </div>

        {/* Per-question results */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Détail des réponses
          </h2>
          {questions.map((q, i) => (
            <QcmQuestion
              key={i}
              question={q}
              index={i}
              total={questions.length}
              selectedAnswer={answers[i]}
              onAnswer={() => {}}
              isSubmitted
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-500 shrink-0">
          {Object.keys(answers).length}/{questions.length}
        </span>
      </div>

      {unanswered.length > 0 && (
        <div className="bg-red-50 rounded-xl px-4 py-3 text-sm text-red-600">
          ⚠️ Réponds à toutes les questions avant de valider (
          {unanswered.map((i) => i + 1).join(", ")})
        </div>
      )}

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div
            key={i}
            id={`q-${i}`}
            className={unanswered.includes(i) ? "ring-2 ring-red-400 rounded-xl" : ""}
          >
            <QcmQuestion
              question={q}
              index={i}
              total={questions.length}
              selectedAnswer={answers[i]}
              onAnswer={(ans) => handleAnswer(i, ans)}
              isSubmitted={false}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl disabled:opacity-50"
      >
        {submitting ? "Correction…" : "✅ Valider mes réponses"}
      </button>
    </div>
  );
}
