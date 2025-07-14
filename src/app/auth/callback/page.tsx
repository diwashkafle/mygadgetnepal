"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const redirectTo = searchParams.get("next") || "/";

      if (session) {
        await syncUserWithAPI();
        router.replace(redirectTo);
      } else {
        // Retry after short delay
        setTimeout(async () => {
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();

          if (retrySession) {
            await syncUserWithAPI();
            router.replace(redirectTo);
          } else {
            router.replace("/"); // fallback if still no session
          }
        }, 1000);
      }
    };

    const syncUserWithAPI = async () => {
      try {
        console.log("calling /api/user")
        const res = await fetch("/api/user", { method: "POST" });
        const body = await res.text();
        console.log("api/user response:", res.status,body)
        if (!res.ok) {
          const err = await res.json();
          console.error("❌ Failed to sync user:", err.error);
        }
      } catch (error) {
        console.error("❌ Network error syncing user:", error);
      }
    };

    handleRedirect();
  }, [supabase, router, searchParams]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
      Finalizing login... please wait.
    </div>
  );
}
