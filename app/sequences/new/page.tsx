"use client";

import { useState } from "react";
import Link from "next/link";
import { createSequence } from "@/actions/sequences";
import { LEVELS } from "@/lib/prompts";
import SubmitButton from "./submit-button";

const SUBJECTS: { label: string; emoji: string; titleHint: string; descHint: string }[] = [
  { label: "Mathématiques", emoji: "📐", titleHint: "ex. Les fractions décimales", descHint: "ex. addition, soustraction et comparaison de fractions" },
  { label: "Français", emoji: "📖", titleHint: "ex. Le récit d'aventure", descHint: "ex. les caractéristiques du récit d'aventure, les temps du récit" },
  { label: "Histoire-Géographie", emoji: "🌍", titleHint: "ex. La Première Guerre mondiale", descHint: "ex. les causes, les grandes batailles, l'armistice de 1918" },
  { label: "Sciences de la Vie et de la Terre", emoji: "🔬", titleHint: "ex. La digestion des aliments", descHint: "ex. le trajet des aliments, les organes digestifs, l'absorption" },
  { label: "Physique-Chimie", emoji: "⚗️", titleHint: "ex. Les circuits électriques", descHint: "ex. circuit en série, en dérivation, rôle de chaque composant" },
  { label: "Anglais", emoji: "🗣️", titleHint: "ex. Present Perfect", descHint: "ex. formation, emploi, mots-clés (already, yet, since, for)" },
  { label: "Arts Plastiques", emoji: "🎨", titleHint: "ex. La perspective", descHint: "ex. point de fuite, lignes de fuite, profondeur" },
  { label: "Musique", emoji: "🎵", titleHint: "ex. Les familles d'instruments", descHint: "ex. cordes, vents, percussions, exemples d'instruments" },
  { label: "EPS", emoji: "⚽", titleHint: "ex. Les règles du handball", descHint: "ex. terrain, nombre de joueurs, fautes, pénaltys" },
  { label: "Technologie", emoji: "💻", titleHint: "ex. Les matériaux", descHint: "ex. propriétés des matériaux, familles, recyclage" },
  { label: "Latin", emoji: "🏛️", titleHint: "ex. Les déclinaisons", descHint: "ex. nominatif, accusatif, génitif, datif, ablatif" },
  { label: "Espagnol", emoji: "🌞", titleHint: "ex. El presente de indicativo", descHint: "ex. verbos regulares -ar, -er, -ir, irregulares" },
];

const QUESTION_COUNTS = [10, 20] as const;
type QuestionCount = 10 | 20;

const STEP_LABELS = ["Matière", "Contenu", "Niveau", "Options", "Docs", "Récap"];

const LEVEL_LABELS: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile", 4: "Expert" };

export default function NewSequencePage() {
  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(2);
  const [helpMode, setHelpMode] = useState(false);
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function next() { setStep((s) => s + 1); }
  function back() { setStep((s) => s - 1); }

  function selectSubject(s: string) {
    setSubject(s);
    setStep(1);
  }

  function selectLevel(v: number) {
    setLevel(v);
    if (v === 4) setHelpMode(false);
    setStep(3);
  }

  function selectQuestionCount(count: QuestionCount) {
    setQuestionCount(count);
    setStep(4);
  }

  const isExpertLevel = level === 4;
  const currentSubject = SUBJECTS.find((s) => s.label === subject);

  const BackButton = ({ toSequences = false }: { toSequences?: boolean }) =>
    toSequences ? (
      <Link
        href="/sequences"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Précédent
      </Link>
    ) : (
      <button
        type="button"
        onClick={back}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Précédent
      </button>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Nouveau quiz</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? "bg-blue-600 text-white" :
                i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                "bg-gray-200 text-gray-400"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 ${i === step ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-0.5 mb-4 mx-1 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} style={{ width: 16 }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0 : Matière ───────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Quelle matière tu veux réviser ?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SUBJECTS.map(({ label, emoji }) => (
              <button
                key={label}
                type="button"
                onClick={() => selectSubject(label)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-colors ${
                  subject === label
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-medium leading-tight">{label}</span>
              </button>
            ))}
          </div>
          <div className="pt-1">
            <BackButton toSequences />
          </div>
        </div>
      )}

      {/* ── Step 1 : Contenu ───────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Donne un titre à ton quiz</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={currentSubject?.titleHint ?? "ex. Les régimes alimentaires"}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ajouter des détails <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={currentSubject?.descHint ?? "ex. précisions sur le sujet à réviser..."}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <BackButton />
            <button
              onClick={next}
              disabled={!title.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 : Niveau ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Choisis ton niveau de difficulté</p>
          {LEVELS.map(({ value, label, emoji, description: desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => selectLevel(value)}
              className={`w-full flex items-start gap-4 px-4 py-4 rounded-xl border-2 text-left transition-colors ${
                level === value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-2xl mt-0.5">{emoji}</span>
              <div>
                <p className={`font-semibold ${level === value ? "text-blue-700" : "text-gray-900"}`}>
                  {label}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
              </div>
              {level === value && (
                <span className="ml-auto text-blue-600 text-lg">✓</span>
              )}
            </button>
          ))}
          <div className="pt-1">
            <BackButton />
          </div>
        </div>
      )}

      {/* ── Step 3 : Options ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Aide */}
          {!isExpertLevel && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Option aide</p>
              <button
                type="button"
                onClick={() => setHelpMode((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-colors ${
                  helpMode
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-left">
                  <p className={`font-semibold ${helpMode ? "text-blue-700" : "text-gray-900"}`}>
                    💡 Avec aide
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Un indice masqué par question — cliquer dessus coûte 0,5 pt
                  </p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${helpMode ? "bg-blue-600" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${helpMode ? "translate-x-6 ml-0.5" : "ml-0.5"}`} />
                </div>
              </button>
            </div>
          )}
          {isExpertLevel && (
            <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500">
              ⚫ Mode Expert — l&apos;aide n&apos;est pas disponible à ce niveau
            </div>
          )}

          {/* Nombre de questions */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Nombre de questions</p>
            <div className="flex gap-3">
              {QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => selectQuestionCount(count)}
                  className={`flex-1 py-4 rounded-xl text-lg font-bold border-2 transition-colors ${
                    questionCount === count
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {count}
                  <span className="block text-xs font-normal text-current opacity-70 mt-0.5">questions</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <BackButton />
          </div>
        </div>
      )}

      {/* ── Step 4 : Documents (optionnel) ────────────────────────── */}
      {step === 4 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            Ajoute tes documents de cours pour un quiz plus précis, ou passe à l&apos;étape suivante.
          </p>

          <label className="flex items-center gap-2 px-4 py-4 border border-dashed border-gray-300 rounded-xl bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            <span className="text-sm text-gray-500">Ajouter des photos ou PDFs</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {files.length > 0 && (
            <ul className="space-y-1">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-700 truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between pt-1">
            <BackButton />
            <button
              onClick={next}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl"
            >
              {files.length > 0 ? "Suivant →" : "Passer →"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 5 : Récap ────────────────────────────────────────── */}
      {step === 5 && (
        <form action={createSequence} className="space-y-5">
          {/* Hidden fields */}
          <input type="hidden" name="subject" value={subject} />
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="description" value={description} />
          <input type="hidden" name="level" value={level} />
          <input type="hidden" name="questionCount" value={questionCount} />
          <input type="hidden" name="helpMode" value={helpMode ? "1" : "0"} />
          {/* Re-attach files via a hidden DataTransfer (handled by SubmitButton) */}

          <p className="text-sm text-gray-500 mb-1">Vérifie avant de lancer la génération</p>

          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Matière</span>
              <span className="text-sm font-medium text-gray-900">
                {currentSubject?.emoji} {subject}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Titre</span>
              <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">{title}</span>
            </div>
            {description.trim() && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">Détails</span>
                <span className="text-sm text-gray-700 text-right max-w-[60%] truncate">{description}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Niveau</span>
              <span className="text-sm font-medium text-gray-900">
                {LEVELS.find((l) => l.value === level)?.emoji} {LEVEL_LABELS[level]}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Questions</span>
              <span className="text-sm font-medium text-gray-900">{questionCount}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Aide</span>
              <span className="text-sm font-medium text-gray-900">
                {isExpertLevel ? "Indisponible (Expert)" : helpMode ? "💡 Activée" : "Désactivée"}
              </span>
            </div>
            {files.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">Documents</span>
                <span className="text-sm font-medium text-gray-900">{files.length} fichier{files.length > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {/* Inject files into the form */}
          <input
            type="file"
            name="files"
            multiple
            className="sr-only"
            ref={(input) => {
              if (input && files.length > 0) {
                const dt = new DataTransfer();
                files.forEach((f) => dt.items.add(f));
                input.files = dt.files;
              }
            }}
          />

          <SubmitButton />

          <div className="pt-1">
            <BackButton />
          </div>
        </form>
      )}
    </div>
  );
}
