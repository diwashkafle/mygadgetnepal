"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo + Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <Image
            src={'/logo.png'}
            alt="MygadgetNepal"
            height={20}
            width={20}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-black/80 transition">Home</Link>
            <Link href="/categories" className="hover:text-black/80 transition">Categories</Link>
            <Link href="/favorites" className="hover:text-black/80 transition">Favorites</Link>
          </nav>
        </div>

        {/* Right: Cart + Auth + Mobile Menu */}
        <div className="flex items-center gap-4">
          <CartIcon />
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="hidden md:inline-block"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signIn("google")}
              className="hidden md:inline-block"
            >
              Login
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
