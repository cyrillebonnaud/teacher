"use server";

import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";

function hashCode(code: string): string {
  return createHash("sha256").update(code.toUpperCase()).digest("hex");
}

export async function loginWithCode(formData: FormData): Promise<{ error?: string }> {
  const code = (formData.get("code") as string)?.trim();
  if (!code) return { error: "Veuillez saisir votre code d'accès" };

  const hash = hashCode(code);

  const { data: parent } = await supabase
    .from("parents")
    .select("id, first_name")
    .eq("access_code_hash", hash)
    .single();

  if (!parent) return { error: "Code d'accès invalide" };

  await setSessionCookie(parent.id);
  redirect("/");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
