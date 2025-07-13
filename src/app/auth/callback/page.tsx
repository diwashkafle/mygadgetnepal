import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function CallbackPage({ searchParams }: { searchParams: { next?: string } }) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const redirectTo = searchParams.next || "/";

  if (session) {
    redirect(redirectTo);
  } else {
    redirect("/login");
  }
}
