export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GenerateQcmForm from "./generate-form";

interface Props {
  params: Promise<{ id: string }>;
}

const LEVELS = [
  {
    level: 1,
    label: "Facile",
    description: "Questions directes sur le cours, réponses évidentes",
    emoji: "🟢",
    color: "border-green-200 hover:border-green-400",
  },
  {
    level: 2,
    label: "Moyen",
    description: "Il faut comprendre, pas juste mémoriser",
    emoji: "🔵",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    level: 3,
    label: "Difficile",
    description: "Analyse, pièges et formulations complexes",
    emoji: "🟠",
    color: "border-orange-200 hover:border-orange-400",
  },
  {
    level: 4,
    label: "Expert",
    description: "Zéro aide — chaque erreur coûte 1 point",
    emoji: "⚫",
    color: "border-gray-400 hover:border-gray-600",
  },
];

export default async function QcmLevelPage({ params }: Props) {
  const { id } = await params;

  const { data: sequence } = await supabase
    .from("sequences")
    .select("*, documents(id)")
    .eq("id", id)
    .single();
  if (!sequence) notFound();

  if (!(sequence.documents as {id:string}[]).length && !sequence.topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/sequences/${id}`} className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Générer un QCM</h1>
        </div>
        <div className="bg-yellow-50 rounded-xl px-6 py-8 text-center">
          <p className="text-4xl mb-3">📂</p>
          <p className="font-semibold text-gray-900 mb-2">Aucun document disponible</p>
          <p className="text-sm text-gray-500 mb-4">
            Uploade d&apos;abord tes documents de cours pour générer un QCM
          </p>
          <Link
            href={`/sequences/${id}/upload`}
            className="inline-block px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Uploader un document
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/sequences/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Choisir le niveau</h1>
          <p className="text-sm text-gray-500">{sequence.emoji} {sequence.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {LEVELS.map(({ level, label, description, emoji, color }) => (
          <GenerateQcmForm
            key={level}
            sequenceId={id}
            level={level}
            label={label}
            description={description}
            emoji={emoji}
            colorClass={color}
          />
        ))}
      </div>
    </div>
  );
}
