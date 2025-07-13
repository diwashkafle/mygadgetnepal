"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PiSignInBold } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";
import CartIconWithBadge from "./CartIcon";

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <Image src="/logo.png" alt="MygadgetNepal" height={30} width={30} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-black/80 transition">
              Home
            </Link>
            <Link href="/categories" className="hover:text-black/80 transition">
              Categories
            </Link>
            <Link href="/favorites" className="hover:text-black/80 transition">
              Favorites
            </Link>
          </nav>
        </div>

        {/* Desktop Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <Input
            type="search"
            placeholder="Search for gadgets..."
            className="w-full"
          />
        </div>

        {/* Desktop Right: Cart + User */}
        <div className="hidden md:flex items-center space-x-4">
          <CartIconWithBadge />
          {session ? (
            <UserDropdown session={session} />
          ) : (
            <button
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: "google" })
              }
              className="inline-flex"
            >
              <PiSignInBold className="text-xl" />
            </button>
          )}
        </div>

        {/* Mobile Right: Search + UserDropdown only */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <Input type="search" placeholder="Search..." className="flex-1 h-9" />

          {session ? (
            <UserDropdown session={session} />
          ) : (
            <button
              onClick={() =>
                supabase.auth.signInWithOAuth({
                   provider: "google" ,
                  options:{
                    redirectTo:`${window.location.origin}/auth/callback?next=/checkout`,
                  }})
              }
              className="inline-flex"
            >
              <PiSignInBold className="text-xl" />
            </button>
          )}
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
