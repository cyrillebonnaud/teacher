"use server";

import { randomBytes, randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

function generateAccessCode(): string {
  // 6 uppercase alphanumeric characters (A-Z0-9)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,1,0 to avoid confusion
  let code = "";
  const bytes = randomBytes(6);
  for (const byte of bytes) {
    code += chars[byte % chars.length];
  }
  return code;
}

export type AddChildResult =
  | { success: true; child: { id: string; firstName: string; level: string; accessCode: string } }
  | { success: false; error: string };

export async function addChild(
  parentId: string,
  firstName: string,
  level: string
): Promise<AddChildResult> {
  if (!firstName.trim()) return { success: false, error: "Le prénom est requis" };
  if (!["6e", "5e", "4e", "3e"].includes(level)) return { success: false, error: "Niveau invalide" };

  const accessCode = generateAccessCode();

  const { data, error } = await supabase
    .from("children")
    .insert({
      id: randomUUID(),
      parent_id: parentId,
      first_name: firstName.trim(),
      level,
      access_code: accessCode,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Impossible de créer l'enfant" };
  }

  revalidatePath("/");
  return {
    success: true,
    child: { id: data.id, firstName: data.first_name, level: data.level, accessCode: data.access_code },
  };
}
