import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "app_access";

export function proxy(request: NextRequest) {
  const accessKey = process.env.APP_ACCESS_KEY;

  // No key configured — gate is fully off. Matches the rest of the app's
  // "inert unless you opt in" pattern (same as Supabase sync).
  if (!accessKey) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === accessKey) return NextResponse.next();

  // A fetch() call from the client can't usefully follow a redirect to an
  // HTML page — respond with 401 JSON instead so the UI can show a real error.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unlockUrl = new URL("/unlock", request.url);
  unlockUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(unlockUrl);
}

export const config = {
  // Everything except the unlock page/API itself and static assets —
  // otherwise the redirect target would be gated too, looping forever.
  matcher: ["/((?!unlock|api/unlock|_next/static|_next/image|favicon.ico).*)"],
};
