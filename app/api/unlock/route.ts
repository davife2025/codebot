import { cookies } from "next/headers";

const COOKIE_NAME = "app_access";

export async function POST(request: Request) {
  const accessKey = process.env.APP_ACCESS_KEY;
  if (!accessKey) {
    return Response.json({ error: "Access gate is not configured" }, { status: 400 });
  }

  let body: { key?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.key !== accessKey) {
    return Response.json({ error: "Incorrect passphrase" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, accessKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return Response.json({ ok: true });
}
