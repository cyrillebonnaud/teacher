"use client";

import { useState, useTransition } from "react";
import { type Question } from "@/lib/prompts";
import QcmQuestion from "@/components/qcm-question";
import { saveAnswer, submitQcm, generateQcm, retryQcmSameQuestions } from "@/actions/evaluations";

interface Props {
  evalId: string;
  sequenceId: string;
  level: number;
  questions: Question[];
  savedAnswers: Record<string, number>;
  isSubmitted: boolean;
  savedScore: number | null;
  helpMode: boolean;
}

function starRating(score: number, total: number): string {
  const pct = Math.max(0, score) / total;
  const stars = Math.round(pct * 5);
  return "⭐".repeat(stars) + "☆".repeat(5 - stars);
}

const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };

export default function QcmPlayer({
  evalId,
  sequenceId,
  level,
  questions,
  savedAnswers,
  isSubmitted,
  savedScore,
  helpMode,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>(
    Object.fromEntries(
      Object.entries(savedAnswers).map(([k, v]) => [Number(k), v])
    )
  );
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [phase, setPhase] = useState<"answering" | "results">(
    isSubmitted ? "results" : "answering"
  );
  const [score, setScore] = useState<number | null>(savedScore);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, startSubmit] = useTransition();
  const [retrying, startRetry] = useTransition();
  const [retryingSame, startRetrySame] = useTransition();

  const isExpert = level === 4;

  async function handleAnswer(questionIdx: number, answerIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionIdx]: answerIdx }));
    await saveAnswer(evalId, questionIdx, answerIdx);
  }

  function handleHintReveal(index: number) {
    setHintsUsed((prev) => prev.includes(index) ? prev : [...prev, index]);
  }

  function handleSubmit() {
    const missing = questions.map((_, i) => i).filter((i) => answers[i] === undefined);
    if (missing.length > 0) {
      setCurrentIndex(missing[0]);
      return;
    }
    startSubmit(async () => {
      const finalScore = await submitQcm(evalId, hintsUsed);
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

  function handleRetrySame() {
    startRetrySame(async () => {
      await retryQcmSameQuestions(evalId);
    });
  }

  // ── Results phase ──────────────────────────────────────────────────────────
  if (phase === "results" && score !== null) {
    const percentage = Math.max(0, Math.round((score / questions.length) * 100));
    const nextLevel = level < 4 ? level + 1 : null;

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-8 text-center">
          <p className="text-5xl font-bold text-gray-900 mb-1">
            {score}/{questions.length}
          </p>
          <p className="text-2xl mb-2">{starRating(score, questions.length)}</p>
          <p className="text-gray-500 text-sm">{percentage}% de bonnes réponses</p>
          {percentage === 100 && (
            <p className="mt-3 text-green-600 font-semibold">🎉 Parfait ! Bravo !</p>
          )}
          {score < 0 && (
            <p className="mt-3 text-orange-600 text-sm">Score négatif — les erreurs comptent double en mode Expert !</p>
          )}
          {/* Badges */}
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              {LEVEL_LABELS[level]}
            </span>
            {helpMode && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                💡 Avec aide
              </span>
            )}
            {isExpert && (
              <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full font-medium">
                ⚫ Expert
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleRetry()}
            disabled={retrying || retryingSame}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {retrying ? "Génération…" : "🔄 Recommencer (questions différentes)"}
          </button>
          <button
            onClick={handleRetrySame}
            disabled={retrying || retryingSame}
            className="w-full py-3 border-2 border-blue-300 text-blue-600 font-semibold rounded-xl disabled:opacity-50"
          >
            {retryingSame ? "Chargement…" : "🔁 Recommencer (mêmes questions)"}
          </button>
          {nextLevel && (
            <button
              onClick={() => handleRetry(nextLevel)}
              disabled={retrying || retryingSame}
              className="w-full py-3 border-2 border-orange-400 text-orange-600 font-semibold rounded-xl disabled:opacity-50"
            >
              ⬆️ Tenter le niveau {LEVEL_LABELS[nextLevel]}
            </button>
          )}
        </div>

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

  // ── Answering phase ────────────────────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Dots progress */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Question {currentIndex + 1}/{questions.length}
          </span>
          <div className="flex items-center gap-2">
            {helpMode && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">💡 Aide</span>
            )}
            {isExpert && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">⚫ Expert</span>
            )}
            <span className="text-xs font-medium text-gray-500">
              {answeredCount}/{questions.length} répondues
            </span>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-6 h-6 rounded-full text-xs font-bold transition-colors ${
                i === currentIndex
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : answers[i] !== undefined
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current question */}
      <QcmQuestion
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        selectedAnswer={answers[currentIndex]}
        onAnswer={(ans) => handleAnswer(currentIndex, ans)}
        isSubmitted={false}
        helpMode={helpMode}
        onHintReveal={handleHintReveal}
        hintRevealed={hintsUsed.includes(currentIndex)}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        {!isFirst && (
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl"
          >
            ← Précédent
          </button>
        )}
        {!isLast ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {submitting ? "Correction…" : allAnswered ? "✅ Valider" : `${answeredCount}/${questions.length} répondues`}
          </button>
        )}
      </div>

      {allAnswered && !isLast && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-xl disabled:opacity-50"
        >
          {submitting ? "Correction…" : "✅ Valider mes réponses"}
        </button>
      )}
    </div>
  );
}
