"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase, uploadToStorage } from "@/lib/supabase";
import { generateQcmAndRedirect } from "@/actions/evaluations";

const SUBJECT_EMOJI: Record<string, string> = {
  "Mathématiques": "📐",
  "Français": "📖",
  "Histoire-Géographie": "🌍",
  "Sciences de la Vie et de la Terre": "🔬",
  "Physique-Chimie": "⚗️",
  "Anglais": "🗣️",
  "Arts Plastiques": "🎨",
  "Musique": "🎵",
  "EPS": "⚽",
  "Technologie": "💻",
  "Latin": "🏛️",
  "Espagnol": "🌞",
};

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export async function createSequence(formData: FormData) {
  const subject = formData.get("subject") as string;
  const rawTitle = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const level = parseInt(formData.get("level") as string) || 2;
  const questionCount = parseInt(formData.get("questionCount") as string) || 10;
  const helpMode = formData.get("helpMode") === "1";
  const rawFiles = formData.getAll("files") as File[];
  const files = rawFiles.filter((f) => f && f.size > 0);

  if (!subject?.trim()) throw new Error("La matière est requise");
  if (!description) throw new Error("La description est requise");

  const title = rawTitle || description.slice(0, 60);

  const validCount = ([10, 20] as number[]).includes(questionCount)
    ? (questionCount as 10 | 20)
    : 10;

  const emoji = SUBJECT_EMOJI[subject] ?? "📚";

  const { data: sequence, error } = await supabase
    .from("sequences")
    .insert({ name: title, subject: subject.trim(), emoji, topic: description || null })
    .select()
    .single();

  if (error || !sequence) throw new Error(error?.message ?? "Impossible de créer la séquence");

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    try {
      const publicUrl = await uploadToStorage("documents", sequence.id + "/" + filename, buffer, file.type);
      await supabase.from("documents").insert({
        sequence_id: sequence.id,
        filename: file.name,
        file_path: publicUrl,
        mime_type: file.type,
        raw_text: "",
      });
    } catch {
      // Skip file on upload error
    }
  }

  await generateQcmAndRedirect(sequence.id, level, validCount, helpMode);
  redirect("/sequences/" + sequence.id + "?error=qcm");
}

export async function updateSequenceDescription(sequenceId: string, topic: string) {
  await supabase.from("sequences").update({ topic: topic.trim() }).eq("id", sequenceId);
  revalidatePath("/sequences/" + sequenceId);
}

export async function deleteSequence(sequenceId: string) {
  await supabase.from("sequences").delete().eq("id", sequenceId);
  revalidatePath("/sequences");
  redirect("/sequences");
}
