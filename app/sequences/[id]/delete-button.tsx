"use client";

import { useState } from "react";
import { deleteSequence } from "@/actions/sequences";

interface Props {
  sequenceId: string;
}

export default function DeleteSequenceButton({ sequenceId }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/50 flex items-end justify-center pb-8 px-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Supprimer la séquence ?</h3>
            <p className="text-sm text-gray-500">
              Tous les documents et évaluations associés seront supprimés définitivement.
            </p>
          </div>
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            <form action={deleteSequence.bind(null, sequenceId)}>
              <button
                type="submit"
                className="w-full py-4 text-red-600 font-semibold text-base"
              >
                Supprimer
              </button>
            </form>
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full py-4 text-gray-500 font-medium text-base"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      aria-label="Supprimer la séquence"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  );
}
