import { type Question } from "@/lib/prompts";

interface Props {
  question: Question;
  index: number;
  total: number;
  selectedAnswer?: number;
  onAnswer: (answerIdx: number) => void;
  isSubmitted: boolean;
}

export default function QcmQuestion({
  question,
  index,
  total,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: Props) {
  function choiceStyle(i: number): string {
    if (!isSubmitted) {
      return selectedAnswer === i
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-800 hover:border-blue-300";
    }
    // After submit
    if (i === question.correct) return "border-green-500 bg-green-50 text-green-800";
    if (i === selectedAnswer) return "border-red-400 bg-red-50 text-red-800";
    return "border-gray-200 bg-gray-50 text-gray-400";
  }

  const LETTERS = ["A", "B", "C", "D"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-gray-400 shrink-0 mt-0.5">
          {index + 1}/{total}
        </span>
        <p className="text-sm font-semibold text-gray-900 leading-snug">{question.question}</p>
      </div>

      <div className="space-y-2">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => !isSubmitted && onAnswer(i)}
            disabled={isSubmitted}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-left transition-colors ${choiceStyle(i)}`}
          >
            <span className="text-xs font-bold shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-current">
              {LETTERS[i]}
            </span>
            <span className="text-sm">{choice}</span>
            {isSubmitted && i === question.correct && (
              <span className="ml-auto text-green-600">✓</span>
            )}
            {isSubmitted && i === selectedAnswer && i !== question.correct && (
              <span className="ml-auto text-red-500">✗</span>
            )}
          </button>
        ))}
      </div>

      {isSubmitted && selectedAnswer !== question.correct && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-700">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
