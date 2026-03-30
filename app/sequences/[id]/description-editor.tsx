"use client";

import { useState, useTransition } from "react";
import { updateSequenceDescription } from "@/actions/sequences";

interface Props {
  sequenceId: string;
  initialTopic: string | null;
}

export default function DescriptionEditor({ sequenceId, initialTopic }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTopic ?? "");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateSequenceDescription(sequenceId, value);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="mb-6">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          autoFocus
          className="w-full px-3 py-2 text-sm border border-blue-400 rounded-lg bg-white focus:outline-none resize-none"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={pending}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {pending ? "Sauvegarde…" : "Enregistrer"}
          </button>
          <button
            onClick={() => { setValue(initialTopic ?? ""); setEditing(false); }}
            className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-start gap-2">
      <p className="flex-1 text-sm text-gray-600 leading-relaxed">
        {value || <span className="text-gray-400 italic">Aucune description</span>}
      </p>
      <button
        onClick={() => setEditing(true)}
        className="shrink-0 text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Modifier
      </button>
    </div>
  );
}
