"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";
import { anthropic, MODEL } from "@/lib/claude";
import { extractTextFromPdf, isSubstantialText } from "@/lib/pdf";
import { buildOcrPrompt } from "@/lib/prompts";

export async function uploadDocument(sequenceId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Aucun fichier sélectionné");

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format non supporté. Utilisez PDF, JPEG ou PNG.");
  }

  // Save file to disk
  const uploadDir = join(process.cwd(), "public", "uploads", sequenceId);
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Extract text
  let rawText = "";

  if (file.type === "application/pdf") {
    // Try native text extraction first
    const extracted = await extractTextFromPdf(buffer);
    if (isSubstantialText(extracted)) {
      rawText = extracted;
    } else {
      // Fallback: Claude vision OCR
      rawText = await extractWithClaude(buffer, file.type, file.name);
    }
  } else {
    // Image: Claude vision OCR directly
    rawText = await extractWithClaude(buffer, file.type, file.name);
  }

  const document = await prisma.document.create({
    data: {
      sequenceId,
      filename: file.name,
      filePath: `/uploads/${sequenceId}/${filename}`,
      mimeType: file.type,
      rawText,
    },
  });

  revalidatePath(`/sequences/${sequenceId}`);
  redirect(`/sequences/${sequenceId}/documents/${document.id}`);
}

async function extractWithClaude(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const base64 = buffer.toString("base64");
  const prompt = buildOcrPrompt(filename);

  const contentBlock =
    mimeType === "application/pdf"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mimeType as
              | "image/jpeg"
              | "image/png"
              | "image/webp"
              | "image/gif",
            data: base64,
          },
        };

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [contentBlock, { type: "text", text: prompt }],
      },
    ],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export async function updateDocumentText(docId: string, rawText: string) {
  const doc = await prisma.document.findUnique({ where: { id: docId } });
  if (!doc) throw new Error("Document introuvable");

  await prisma.document.update({
    where: { id: docId },
    data: { rawText },
  });

  revalidatePath(`/sequences/${doc.sequenceId}/documents/${docId}`);
}

export async function deleteDocument(docId: string) {
  const doc = await prisma.document.findUnique({ where: { id: docId } });
  if (!doc) throw new Error("Document introuvable");

  await prisma.document.delete({ where: { id: docId } });
  revalidatePath(`/sequences/${doc.sequenceId}`);
  redirect(`/sequences/${doc.sequenceId}`);
}
