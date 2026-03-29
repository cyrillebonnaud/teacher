export interface Question {
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
}

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: `Questions FACILES portant sur des faits directs et du vocabulaire de base.
Chaque question doit avoir une réponse clairement identifiable dans le cours.
Les distracteurs sont facilement éliminables.`,
  2: `Questions de NIVEAU MOYEN nécessitant de comprendre le sens du cours,
faire des liens entre concepts, ou reformuler des idées.
Les distracteurs sont plausibles mais un élève attentif peut les éliminer.`,
  3: `Questions EXPERTES d'analyse et de mise en relation de plusieurs concepts.
Les questions peuvent inclure des "pièges" subtils.
Les distracteurs sont très plausibles et nécessitent une lecture attentive du cours.`,
};

export function buildQcmPrompt(
  level: number,
  courseText: string,
  previousQuestions: string[] = []
): string {
  const levelDesc = LEVEL_DESCRIPTIONS[level];
  const previousNote =
    previousQuestions.length > 0
      ? `\n\nÉVITE ces questions déjà posées:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  return `Tu es un professeur expert créant des QCM pour un élève de 5e (collège français).

NIVEAU : ${level}/3 — ${levelDesc}

Génère exactement 10 questions à choix multiples basées UNIQUEMENT sur ce cours.
Chaque question doit avoir 4 choix (A, B, C, D) avec une seule bonne réponse.${previousNote}

COURS :
---
${courseText}
---

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication.
Format exact :
[
  {
    "question": "...",
    "choices": ["...", "...", "...", "..."],
    "correct": 0,
    "explanation": "Explication courte et pédagogique de la bonne réponse"
  }
]`;
}

export function buildOcrPrompt(filename: string): string {
  return `Extrait tout le texte de ce document de cours scolaire (fichier: ${filename}).
Transcris le contenu tel quel, en conservant la structure (titres, listes, paragraphes).
Si c'est de l'écriture manuscrite, fais de ton mieux pour la déchiffrer.
Réponds UNIQUEMENT avec le texte extrait, sans commentaire.`;
}

export function buildChatSystemPrompt(
  sequenceName: string,
  documentTexts: string[]
): string {
  const docsContent = documentTexts
    .map((text, i) => `--- Document ${i + 1} ---\n${text}`)
    .join("\n\n");

  return `Tu es un assistant pédagogique aidant un élève de 5e à réviser la séquence "${sequenceName}".
Tu réponds en français, avec un langage adapté à un collégien de 12 ans.
Tu bases tes réponses UNIQUEMENT sur les documents de cours fournis ci-dessous.
Si la question dépasse le contenu des cours, dis-le clairement et suggère d'uploader plus de documents.
Sois encourageant, clair et pédagogique.

DOCUMENTS DE COURS :
${docsContent}`;
}
