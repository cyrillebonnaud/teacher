"use client";

import { useState } from "react";
import { generateQcm } from "@/actions/evaluations";

interface Props {
  sequenceId: string;
  level: number;
  label: string;
  description: string;
  emoji: string;
  colorClass: string;
}

export default function GenerateQcmForm({
  sequenceId,
  level,
  label,
  description,
  emoji,
  colorClass,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await generateQcm(sequenceId, level);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la génération");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full bg-white rounded-xl border-2 px-5 py-4 text-left transition-colors disabled:opacity-50 ${colorClass}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{emoji}</span>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          {loading ? (
            <span className="text-sm text-gray-400 animate-pulse">Génération…</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );
}
