"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { anthropic, MODEL } from "@/lib/claude";
import { buildQcmPrompt, type Question } from "@/lib/prompts";

export async function generateQcm(
  sequenceId: string,
  level: number,
  previousQuestions: string[] = []
) {
  const documents = await prisma.document.findMany({
    where: { sequenceId },
    orderBy: { createdAt: "asc" },
  });

  const courseText = documents
    .map((d) => d.rawText)
    .filter((t) => t.trim().length > 0)
    .join("\n\n---\n\n");

  if (!courseText.trim()) {
    throw new Error(
      "Aucun contenu extrait des documents. Vérifiez vos uploads."
    );
  }

  const prompt = buildQcmPrompt(level, courseText, previousQuestions);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawContent = response.content[0];
  if (rawContent.type !== "text") throw new Error("Réponse inattendue de Claude");

  let questions: Question[];
  try {
    const jsonText = rawContent.text.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    questions = JSON.parse(jsonText);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Format invalide");
    }
  } catch {
    throw new Error("Impossible de parser les questions générées");
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      sequenceId,
      level,
      questions: JSON.stringify(questions),
      answers: "{}",
    },
  });

  redirect(`/sequences/${sequenceId}/qcm/${evaluation.id}`);
}

export async function saveAnswer(
  evalId: string,
  questionIdx: number,
  answerIdx: number
) {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evalId },
  });
  if (!evaluation || evaluation.submittedAt) return;

  const answers = JSON.parse(evaluation.answers) as Record<string, number>;
  answers[questionIdx] = answerIdx;

  await prisma.evaluation.update({
    where: { id: evalId },
    data: { answers: JSON.stringify(answers) },
  });
}

export async function submitQcm(evalId: string): Promise<number> {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evalId },
  });
  if (!evaluation) throw new Error("Évaluation introuvable");

  const questions = JSON.parse(evaluation.questions) as Question[];
  const answers = JSON.parse(evaluation.answers) as Record<string, number>;

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correct) score++;
  }

  await prisma.evaluation.update({
    where: { id: evalId },
    data: { score, submittedAt: new Date() },
  });

  revalidatePath(`/sequences/${evaluation.sequenceId}`);
  return score;
}
