"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createSequence(formData: FormData) {
  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const emoji = (formData.get("emoji") as string) || "📚";

  if (!name?.trim() || !subject?.trim()) {
    throw new Error("Le nom et la matière sont requis");
  }

  const sequence = await prisma.sequence.create({
    data: { name: name.trim(), subject: subject.trim(), emoji },
  });

  redirect(`/sequences/${sequence.id}`);
}

export async function deleteSequence(sequenceId: string) {
  await prisma.sequence.delete({ where: { id: sequenceId } });
  revalidatePath("/sequences");
  redirect("/sequences");
}
