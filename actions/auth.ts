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

  // Try parent first (stored as hash)
  const hash = hashCode(code);
  const { data: parent } = await supabase
    .from("parents")
    .select("id")
    .eq("access_code_hash", hash)
    .single();

  if (parent) {
    await setSessionCookie("parent", parent.id);
    redirect("/");
  }

  // Try child (stored as plain uppercase)
  const { data: child } = await supabase
    .from("children")
    .select("id")
    .eq("access_code", code.toUpperCase())
    .single();

  if (child) {
    await setSessionCookie("child", child.id);
    redirect(`/children/${child.id}`);
  }

  return { error: "Code d'accès invalide" };
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
