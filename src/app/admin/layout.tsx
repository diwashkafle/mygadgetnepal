import React from "react";
import Sidebar from "@/components/admin-dashboard/Sidebar";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) redirect("/login");

  // const currentUser = await prisma.user.findUnique({
  //   where: { email: user.email },
  // });

  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   redirect("/unauthorized");
  // }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 animate-fade-in">{children}</main>
    </div>
  );
}
