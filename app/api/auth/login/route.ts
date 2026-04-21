import { NextResponse } from "next/server";
import { signToken, hashPassword, type UserRole } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  const hash = await hashPassword(password);

  let role: UserRole | null = null;
  if (hash === process.env.EDITOR_PASSWORD_HASH) {
    role = "editor";
  } else if (hash === process.env.SITE_PASSWORD_HASH) {
    role = "viewer";
  }

  if (!role) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const token = await signToken(role);

  const res = NextResponse.json({ ok: true, role });
  res.headers.set("Cache-Control", "no-store");

  // Session cookie — no maxAge means it expires when the browser is closed.
  // HttpOnly so JS cannot read or steal the JWT via XSS.
  res.cookies.set("site_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
  // Readable role cookie — only used as a hint for non-security UI.
  // The authoritative role check is always the HttpOnly site_token JWT.
  res.cookies.set("user_role", role, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
