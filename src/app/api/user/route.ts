import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = await createApiClient();
    console.log('api/user called')
  const {
    data: { session },
  } = await supabase.auth.getSession();
console.log("supabase session: ",session)
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 }); 
  }

  const user = session.user;

  // Check if already exists
  const { data: existingUser, error } = await supabase
    .from("User")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingUser && !error) {
    const { error: insertError } = await supabase.from("User").insert({
      id: user.id,
      email: user.email,
      role: user.email === "no2codemaster@gmail.com" ? "ADMIN" : "USER",
    });

    if (insertError) {
      console.error("Insert user failed:", insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ok" });
}
