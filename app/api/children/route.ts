import { NextResponse } from "next/server";
import { getCurrentParent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const parent = await getCurrentParent().catch(() => null);
  if (!parent) return NextResponse.json({ children: [] });

  const { data } = await supabase
    .from("children")
    .select("id, first_name, level")
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ children: data ?? [] });
}
