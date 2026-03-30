"use client";

import { useState, useTransition } from "react";
import { addChild } from "@/actions/children";

const LEVELS = ["6e", "5e", "4e", "3e"];

export default function AddChildForm({ parentId }: { parentId: string }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [level, setLevel] = useState("5e");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    setGeneratedCode(null);
    setError(null);
    setFirstName("");
    setLevel("5e");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addChild(parentId, firstName, level);
      if (result.success) {
        setGeneratedCode(result.child.accessCode);
        setFirstName("");
      } else {
        setError(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Ajouter un enfant
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Nouvel enfant</h2>

      {generatedCode ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 mb-1">Enfant créé ! Code d&apos;accès :</p>
            <p className="text-3xl font-mono font-bold text-green-800 tracking-widest">{generatedCode}</p>
            <p className="text-xs text-green-600 mt-1">Note ce code — il est affiché dans la liste de tes enfants</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setGeneratedCode(null); setOpen(false); }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl"
            >
              Terminé
            </button>
            <button
              onClick={() => { setGeneratedCode(null); }}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl"
            >
              Ajouter un autre
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="ex. Lucas"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    level === l
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !firstName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
            >
              {isPending ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
