import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const COOKIE_NAME = "parent_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  const secret =
    process.env.PARENT_SESSION_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "teacher-dev-session-secret-change-in-prod"
      : null);
  if (!secret) throw new Error("Missing PARENT_SESSION_SECRET env var");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(parentId: string): Promise<string> {
  return new SignJWT({ parentId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<{ parentId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { parentId: payload.parentId as string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(parentId: string): Promise<void> {
  const token = await createSessionToken(parentId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export type SessionParent = {
  id: string;
  firstName: string;
};

export async function getCurrentParent(): Promise<SessionParent | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const { createClient: create } = await import("@supabase/supabase-js");
  const client = create(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await client
    .from("parents")
    .select("id, first_name")
    .eq("id", payload.parentId)
    .single();

  if (!data) return null;
  return { id: data.id, firstName: data.first_name };
}
