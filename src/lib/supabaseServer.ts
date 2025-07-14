// lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies as getCookies, headers } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * ✅ For use in server components (e.g. layout.tsx, page.tsx)
 */
export async function createServerSupabaseClient() {
  const cookieStore = await getCookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * ✅ For use in API routes (e.g. /api/user/route.ts)
 */
export async function createApiClient() {
  const cookieStore: ReadonlyRequestCookies & {
    set?: (data: { name: string; value: string } & CookieOptions) => void;
    delete?: (data: { name: string } & CookieOptions) => void;
  } = await getCookies();

  const headersList = await headers();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          const cookieParts = [`${name}=${value}`, "Path=/", "HttpOnly", "SameSite=Lax"];
          if (options.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
          if (options.expires) cookieParts.push(`Expires=${options.expires.toUTCString()}`);
          headersList.append("Set-Cookie", cookieParts.join("; "));
        },
        remove(name) {
          headersList.append("Set-Cookie", `${name}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
        },
      },
    }
  );
}
