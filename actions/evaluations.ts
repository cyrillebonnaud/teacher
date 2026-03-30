"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { claudeJson } from "@/lib/claude";
import { buildQcmPrompt, buildFreeTopicQcmPrompt, type Question } from "@/lib/prompts";

function buildSchema(questionCount: number, helpMode: boolean) {
  const questionProps: Record<string, unknown> = {
    question: { type: "string" },
    choices: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
    correct: { type: "integer", minimum: 0, maximum: 3 },
    explanation: { type: "string" },
  };
  const required = ["question", "choices", "correct", "explanation"];
  if (helpMode) {
    questionProps.hint = { type: "string" };
    required.push("hint");
  }
  return {
    type: "array",
    items: {
      type: "object",
      properties: questionProps,
      required,
      additionalProperties: false,
    },
    minItems: questionCount,
    maxItems: questionCount,
  };
}

export async function generateQcm(
  sequenceId: string,
  level: number,
  previousQuestions: string[] = [],
  questionCount: 10 | 20 = 10,
  helpMode = false
) {
  const { data: sequence } = await supabase
    .from("sequences")
    .select("*, documents(*)")
    .eq("id", sequenceId)
    .single();

  if (!sequence) throw new Error("Séquence introuvable");

  const courseText = (sequence.documents as { raw_text: string }[])
    .map((d) => d.raw_text)
    .filter((t: string) => t.trim().length > 0)
    .join("\n\n---\n\n");

  const schema = buildSchema(questionCount, helpMode);

  let prompt: string;
  if (courseText.trim()) {
    prompt = buildQcmPrompt(level, courseText, previousQuestions, questionCount, helpMode);
  } else if (sequence.topic?.trim()) {
    prompt = buildFreeTopicQcmPrompt(sequence.topic, level, previousQuestions, questionCount, helpMode);
  } else {
    throw new Error("Aucun contenu disponible. Uploadez des documents ou créez une séquence libre.");
  }

  const questions = await claudeJson<Question[]>(prompt, schema);
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Impossible de générer les questions");
  }

  const { data: evaluation, error } = await supabase
    .from("evaluations")
    .insert({
      sequence_id: sequenceId,
      level,
      questions: JSON.stringify(questions),
      answers: "{}",
      help_mode: helpMode,
    })
    .select()
    .single();

  if (error || !evaluation) throw new Error(error?.message ?? "Impossible de créer l'évaluation");

  redirect("/sequences/" + sequenceId + "/qcm/" + evaluation.id);
}

export async function generateQcmAndRedirect(
  sequenceId: string,
  level: number,
  questionCount: 10 | 20 = 10,
  helpMode = false
): Promise<void> {
  try {
    await generateQcm(sequenceId, level, [], questionCount, helpMode);
  } catch (e: unknown) {
    if (e instanceof Error && (e.message === "NEXT_REDIRECT" || e.message.startsWith("NEXT_"))) {
      throw e;
    }
  }
}

export async function retryQcmSameQuestions(evalId: string) {
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select()
    .eq("id", evalId)
    .single();
  if (!evaluation) throw new Error("Evaluation introuvable");

  const { data: newEval, error } = await supabase
    .from("evaluations")
    .insert({
      sequence_id: evaluation.sequence_id,
      level: evaluation.level,
      questions: evaluation.questions,
      answers: "{}",
      help_mode: evaluation.help_mode,
    })
    .select()
    .single();

  if (error || !newEval) throw new Error(error?.message ?? "Impossible de créer l'évaluation");

  redirect("/sequences/" + evaluation.sequence_id + "/qcm/" + newEval.id);
}

export async function saveAnswer(evalId: string, questionIdx: number, answerIdx: number) {
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("answers, submitted_at")
    .eq("id", evalId)
    .single();
  if (!evaluation || evaluation.submitted_at) return;

  const answers = JSON.parse(evaluation.answers) as Record<string, number>;
  answers[questionIdx] = answerIdx;

  await supabase
    .from("evaluations")
    .update({ answers: JSON.stringify(answers) })
    .eq("id", evalId);
}

export async function submitQcm(
  evalId: string,
  hintsUsed: number[] = []
): Promise<number> {
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select()
    .eq("id", evalId)
    .single();
  if (!evaluation) throw new Error("Évaluation introuvable");

  const questions = JSON.parse(evaluation.questions) as Question[];
  const answers = JSON.parse(evaluation.answers) as Record<string, number>;
  const isExpert = evaluation.level === 4;
  const helpMode = evaluation.help_mode as boolean;

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    const isCorrect = answers[i] === questions[i].correct;
    const hintUsed = helpMode && hintsUsed.includes(i);

    if (isCorrect) {
      score += hintUsed ? 0.5 : 1;
    } else if (isExpert) {
      score -= 1;
    }
  }

  // Round to avoid float imprecision (e.g. 9.5 stored as 9.499...)
  const roundedScore = Math.round(score * 10) / 10;

  await supabase
    .from("evaluations")
    .update({ score: roundedScore, submitted_at: new Date().toISOString() })
    .eq("id", evalId);

  revalidatePath("/sequences/" + evaluation.sequence_id);
  return roundedScore;
}
