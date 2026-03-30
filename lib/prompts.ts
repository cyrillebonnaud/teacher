export interface Question {
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  hint?: string;
}

export const LEVELS = [
  {
    value: 1,
    label: "Facile",
    emoji: "🟢",
    description: "Questions directes sur le cours, réponses évidentes",
  },
  {
    value: 2,
    label: "Moyen",
    emoji: "🔵",
    description: "Il faut comprendre, pas juste mémoriser",
  },
  {
    value: 3,
    label: "Difficile",
    emoji: "🟠",
    description: "Analyse, pièges et formulations complexes",
  },
  {
    value: 4,
    label: "Expert",
    emoji: "⚫",
    description: "Zéro aide — chaque erreur coûte 1 point",
  },
] as const;

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: `Niveau FACILE — questions directes portant sur des faits clairement énoncés.
La réponse est identifiable sans analyse. Les distracteurs sont facilement éliminables.`,
  2: `Niveau MOYEN — compréhension et mise en lien de concepts.
L'élève doit reformuler ou relier deux idées du cours. Les distracteurs sont plausibles.`,
  3: `Niveau DIFFICILE — analyse et application à des situations nouvelles.
Les questions demandent de raisonner à partir du cours, pas juste de le réciter.
Les distracteurs sont très proches et nécessitent une lecture attentive.`,
  4: `Niveau EXPERT — synthèse, pièges et raisonnement avancé.
Questions de haut niveau nécessitant de croiser plusieurs concepts.
Les distracteurs sont subtils et peuvent piéger un élève peu attentif.`,
};

function hintInstruction(helpMode: boolean): string {
  if (!helpMode) return "";
  return `\n\nPour chaque question, ajoute un champ "hint" : une courte indication (1 phrase max) qui oriente sans donner la réponse.`;
}

function jsonFormat(helpMode: boolean): string {
  const hintField = helpMode ? `\n    "hint": "...",` : "";
  return `[
  {
    "question": "...",
    "choices": ["choix A", "choix B", "choix C", "choix D"],
    "correct": 2,
    "explanation": "Explication courte et pédagogique de la bonne réponse",${hintField}
  }
]

IMPORTANT : "correct" est l'index (0-3) de la bonne réponse dans "choices". Varie aléatoirement sa position d'une question à l'autre — ne mets PAS toujours la bonne réponse en position 0.`;
}

export function buildQcmPrompt(
  level: number,
  courseText: string,
  previousQuestions: string[] = [],
  questionCount = 10,
  helpMode = false,
  subject = "",
  title = ""
): string {
  const levelDesc = LEVEL_DESCRIPTIONS[level];
  const previousNote =
    previousQuestions.length > 0
      ? `\n\nÉVITE ces questions déjà posées:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";
  const contextLines = [
    subject ? `MATIÈRE : ${subject}` : "",
    title ? `SÉQUENCE : ${title}` : "",
  ].filter(Boolean).join("\n");

  return `Tu es un professeur expert créant des QCM pour un élève de 5e (collège français).

${contextLines ? contextLines + "\n" : ""}NIVEAU : ${level}/4 — ${levelDesc}${hintInstruction(helpMode)}

Génère exactement ${questionCount} questions à choix multiples basées UNIQUEMENT sur ce cours.
Chaque question doit avoir 4 choix (A, B, C, D) avec une seule bonne réponse.${previousNote}

COURS :
---
${courseText}
---

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication.
Format exact :
${jsonFormat(helpMode)}`;
}

export function buildFreeTopicQcmPrompt(
  topic: string,
  level: number,
  previousQuestions: string[] = [],
  questionCount = 10,
  helpMode = false,
  subject = "",
  title = ""
): string {
  const levelDesc = LEVEL_DESCRIPTIONS[level];
  const previousNote =
    previousQuestions.length > 0
      ? `\n\nÉVITE ces questions déjà posées:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";
  const contextLines = [
    subject ? `MATIÈRE : ${subject}` : "",
    title ? `SÉQUENCE : ${title}` : "",
  ].filter(Boolean).join("\n");

  return `Tu es un professeur expert créant des QCM pour un élève de 5e (collège français, programme officiel Éducation Nationale).

${contextLines ? contextLines + "\n" : ""}SUJET : ${topic}
NIVEAU : ${level}/4 — ${levelDesc}${hintInstruction(helpMode)}

Génère exactement ${questionCount} questions à choix multiples sur ce sujet, adaptées au programme de 5e.
Tes questions doivent être factuellement correctes et conformes au programme scolaire français.
Chaque question doit avoir 4 choix (A, B, C, D) avec une seule bonne réponse.${previousNote}

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication.
Format exact :
${jsonFormat(helpMode)}`;
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
