"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg disabled:opacity-60"
    >
      {pending ? "Création en cours..." : "Créer le quiz"}
    </button>
  );
}
