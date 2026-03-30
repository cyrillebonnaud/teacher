/**
 * Seed child Emile (5e) for parent Cyrille.
 * Usage: npx tsx scripts/seed-emile.ts
 */

import { createClient } from "@supabase/supabase-js";
import { createHash, randomUUID, randomBytes } from "crypto";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = randomBytes(6);
  for (const byte of bytes) code += chars[byte % chars.length];
  return code;
}

async function main() {
  // Find parent Cyrille
  const hash = createHash("sha256").update("CYRILLE").digest("hex");
  const { data: parent } = await supabase
    .from("parents")
    .select("id, first_name")
    .eq("access_code_hash", hash)
    .single();

  if (!parent) {
    console.error("Parent Cyrille not found. Run seed-parent.ts first.");
    process.exit(1);
  }

  // Check if Emile already exists
  const { data: existing } = await supabase
    .from("children")
    .select("id, first_name, access_code")
    .eq("parent_id", parent.id)
    .ilike("first_name", "emile")
    .maybeSingle();

  if (existing) {
    console.log(`Emile already exists (id: ${existing.id}, code: ${existing.access_code})`);
    return;
  }

  const accessCode = generateAccessCode();
  const { data: child, error } = await supabase
    .from("children")
    .insert({ id: randomUUID(), parent_id: parent.id, first_name: "Emile", level: "5e", access_code: accessCode })
    .select()
    .single();

  if (error || !child) {
    console.error("Failed:", error?.message);
    process.exit(1);
  }

  console.log(`Child seeded: ${child.first_name} (${child.level}) — code: ${child.access_code}`);
}

main();
