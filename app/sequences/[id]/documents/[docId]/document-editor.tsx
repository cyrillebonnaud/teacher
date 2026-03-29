"use client";

import { useState, useTransition } from "react";
import { updateDocumentText, deleteDocument } from "@/actions/documents";

interface Props {
  docId: string;
  initialText: string;
}

export default function DocumentEditor({ docId, initialText }: Props) {
  const [text, setText] = useState(initialText);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateDocumentText(docId, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Texte extrait</h2>
        <span className="text-xs text-gray-400">{text.length} caractères</span>
      </div>

      {text.trim().length === 0 && (
        <div className="bg-yellow-50 rounded-lg px-4 py-3 text-sm text-yellow-700">
          ⚠️ Aucun texte extrait. Vérifie la qualité du document ou tape le contenu manuellement.
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder="Le texte extrait du document apparaîtra ici. Tu peux le corriger."
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500 resize-none leading-relaxed"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {isPending ? "Enregistrement…" : saved ? "✓ Enregistré" : "Enregistrer"}
        </button>
        <form action={deleteDocument.bind(null, docId)}>
          <button
            type="submit"
            className="px-4 py-3 border border-gray-300 text-red-500 font-medium rounded-lg"
          >
            Supprimer
          </button>
        </form>
      </div>
    </div>
  );
}
