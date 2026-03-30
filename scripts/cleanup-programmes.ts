import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  // Delete non-5e programmes
  const { error, count } = await sb.from("programmes").delete({ count: "exact" }).neq("level", "5e");
  if (error) { console.error("Error:", error.message); process.exit(1); }
  console.log(`Deleted ${count} non-5e programmes`);

  // Rename Emile's access code to EMILE
  const { error: e2, data } = await sb.from("children").update({ access_code: "EMILE" }).ilike("first_name", "emile").select();
  if (e2) { console.error("Error:", e2.message); process.exit(1); }
  console.log(`Updated access code for:`, data?.map(c => c.first_name));
}
main();
