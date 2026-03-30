import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Test-only route: creates a sequence directly without QCM generation
// Only available outside production
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { name, subject } = await req.json();
  const { data: sequence, error } = await supabase
    .from("sequences")
    .insert({
      name: name ?? `Test-${Date.now()}`,
      subject: subject ?? "Mathématiques",
      emoji: "📚",
      topic: name ?? `Test-${Date.now()}`,
    })
    .select()
    .single();

  if (error || !sequence) return NextResponse.json({ error: error?.message }, { status: 500 });
  return NextResponse.json({ id: sequence.id });
}
