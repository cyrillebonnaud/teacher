"use client";

import { useState, useTransition } from "react";
import { loginWithCode } from "@/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginWithCode(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher</h1>
          <p className="text-sm text-gray-500 mt-1">Espace parents</p>
        </div>

        <form action={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code d&apos;accès
            </label>
            <input
              type="text"
              name="code"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="ex. CYRILLE"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500 uppercase tracking-widest"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
