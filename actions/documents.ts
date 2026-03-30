"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase, uploadToStorage } from "@/lib/supabase";
import { claudeVision } from "@/lib/claude";
import { extractTextFromPdf, isSubstantialText } from "@/lib/pdf";

export async function uploadDocument(sequenceId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Aucun fichier sélectionné");

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format non supporté. Utilisez PDF, JPEG ou PNG.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const publicUrl = await uploadToStorage("documents", sequenceId + "/" + filename, buffer, file.type);

  const rawText = await extractText(buffer, file.type, file.name);

  const { data: document, error } = await supabase
    .from("documents")
    .insert({
      id: randomUUID(),
      sequence_id: sequenceId,
      filename: file.name,
      file_path: publicUrl,
      mime_type: file.type,
      raw_text: rawText,
    })
    .select()
    .single();

  if (error || !document) throw new Error(error?.message ?? "Impossible de créer le document");

  revalidatePath("/sequences/" + sequenceId);
  redirect("/sequences/" + sequenceId + "/documents/" + document.id);
}

async function extractText(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const nativeText = await extractTextFromPdf(buffer);
    if (isSubstantialText(nativeText)) return nativeText;
  }
  try {
    return await claudeVision(buffer, mimeType, filename);
  } catch {
    return "";
  }
}

export async function updateDocumentText(docId: string, rawText: string) {
  const { data: doc } = await supabase.from("documents").select("sequence_id").eq("id", docId).single();
  if (!doc) throw new Error("Document introuvable");

  await supabase.from("documents").update({ raw_text: rawText }).eq("id", docId);
  revalidatePath("/sequences/" + doc.sequence_id + "/documents/" + docId);
}

export async function deleteDocument(docId: string) {
  const { data: doc } = await supabase.from("documents").select("sequence_id").eq("id", docId).single();
  if (!doc) throw new Error("Document introuvable");

  await supabase.from("documents").delete().eq("id", docId);
  revalidatePath("/sequences/" + doc.sequence_id);
  redirect("/sequences/" + doc.sequence_id);
}
