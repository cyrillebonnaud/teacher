import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";
import { createSessionToken } from "@/lib/auth";

// Test-only route: sets a session cookie directly for a given access code
// Only available outside production
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const upper = (code as string).toUpperCase();

  // Try parent
  const hash = createHash("sha256").update(upper).digest("hex");
  const { data: parent } = await supabase.from("parents").select("id").eq("access_code_hash", hash).single();
  if (parent) {
    const token = await createSessionToken("parent", parent.id);
    const res = NextResponse.json({ type: "parent", id: parent.id });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  // Try child
  const { data: child } = await supabase.from("children").select("id").eq("access_code", upper).single();
  if (child) {
    const token = await createSessionToken("child", child.id);
    const res = NextResponse.json({ type: "child", id: child.id });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Code invalide" }, { status: 401 });
}
