import React from "react";
import Sidebar from "@/components/admin-dashboard/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 animate-fade-in">{children}</main>
    </div>
  );
}
