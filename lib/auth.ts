import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "relay_session";
export const CONNECTED_COOKIE = "relay_connected";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET ?? "relay-dev-session-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export type Session = {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
};

export function encodeSession(session: Session) {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = Buffer.from(
    JSON.stringify({ ...session, exp }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined | null): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now()) return null;
    if (!data.userId || !data.tenantId) return null;
    return {
      userId: data.userId,
      tenantId: data.tenantId,
      email: data.email,
      name: data.name,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  };
}

export function applySessionCookie(res: NextResponse, session: Session) {
  res.cookies.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions());
  return res;
}

export function applyConnectedCookie(res: NextResponse, connected: boolean) {
  if (connected) {
    res.cookies.set(CONNECTED_COOKIE, "1", sessionCookieOptions());
  } else {
    res.cookies.set(CONNECTED_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  }
  return res;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function setSessionCookie(session: Session) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions());
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionTenant() {
  const session = await getSession();
  if (!session) return null;
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
  });
  return tenant ? { session, tenant } : null;
}
