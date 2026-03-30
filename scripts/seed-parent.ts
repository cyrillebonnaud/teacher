/**
 * Seed the parent "Cyrille" with access code CYRILLE.
 * Idempotent: uses upsert on access_code_hash.
 *
 * Usage: npx tsx scripts/seed-parent.ts
 */

import { createHash, randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function hashCode(code: string): string {
  return createHash("sha256").update(code.toUpperCase()).digest("hex");
}

async function main() {
  const code = "CYRILLE";
  const hash = hashCode(code);

  const { data, error } = await supabase
    .from("parents")
    .upsert(
      { id: randomUUID(), first_name: "Cyrille", access_code_hash: hash },
      { onConflict: "access_code_hash" }
    )
    .select()
    .single();

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Parent seeded: ${data.first_name} (id: ${data.id})`);
  console.log(`Access code: ${code}`);
}

main();
