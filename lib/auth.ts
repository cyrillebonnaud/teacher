import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionType = "parent" | "child";

export type Session =
  | { type: "parent"; id: string; firstName: string }
  | { type: "child"; id: string; firstName: string; level: string; parentId: string };

function getSecret(): Uint8Array {
  const secret =
    process.env.PARENT_SESSION_SECRET ??
    "teacher-dev-session-secret-change-in-prod";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(type: SessionType, id: string): Promise<string> {
  return new SignJWT({ type, id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<{ type: SessionType; id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.type || !payload.id) return null;
    return { type: payload.type as SessionType, id: payload.id as string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(type: SessionType, id: string): Promise<void> {
  const token = await createSessionToken(type, id);
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
  // Also clear old cookie name for backwards compat
  cookieStore.delete("parent_session");
}

async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  // Support both old and new cookie name
  return (
    cookieStore.get(COOKIE_NAME)?.value ??
    cookieStore.get("parent_session")?.value ??
    null
  );
}

export async function getSession(): Promise<Session | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  if (payload.type === "parent") {
    const { data } = await client
      .from("parents")
      .select("id, first_name")
      .eq("id", payload.id)
      .single();
    if (!data) return null;
    return { type: "parent", id: data.id, firstName: data.first_name };
  } else {
    const { data } = await client
      .from("children")
      .select("id, first_name, level, parent_id")
      .eq("id", payload.id)
      .single();
    if (!data) return null;
    return { type: "child", id: data.id, firstName: data.first_name, level: data.level, parentId: data.parent_id };
  }
}

// Convenience helper for pages that only need parent info
export async function getCurrentParent(): Promise<{ id: string; firstName: string } | null> {
  const session = await getSession();
  if (!session || session.type !== "parent") return null;
  return { id: session.id, firstName: session.firstName };
}
