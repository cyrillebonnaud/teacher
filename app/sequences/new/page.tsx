import Link from "next/link";
import { createSequence } from "@/actions/sequences";

const EMOJIS = ["📚", "📐", "🔬", "🌍", "🎨", "🏛️", "📖", "🔢", "🌿", "⚗️", "🎵", "💻"];

const SUBJECTS = [
  "Mathématiques",
  "Français",
  "Histoire-Géographie",
  "Sciences de la Vie et de la Terre",
  "Physique-Chimie",
  "Anglais",
  "Arts Plastiques",
  "Musique",
  "EPS",
  "Technologie",
  "Latin",
  "Espagnol",
];

export default function NewSequencePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/sequences" className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Nouvelle séquence</h1>
      </div>

      <form action={createSequence} className="space-y-5">
        {/* Emoji picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((emoji, i) => (
              <label key={emoji} className="cursor-pointer">
                <input
                  type="radio"
                  name="emoji"
                  value={emoji}
                  defaultChecked={i === 0}
                  className="sr-only peer"
                />
                <span className="w-10 h-10 flex items-center justify-center text-2xl rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors">
                  {emoji}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la séquence
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="ex. Le Moyen Âge, Les fractions..."
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Matière
          </label>
          <select
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
          >
            <option value="">Choisir une matière...</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg"
        >
          Créer la séquence
        </button>
      </form>
    </div>
  );
}
