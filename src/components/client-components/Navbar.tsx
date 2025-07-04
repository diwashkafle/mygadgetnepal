"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import { LucideShoppingBag } from "lucide-react";
import { PiSignInBold } from "react-icons/pi";
import { Input } from "@/components/ui/input";

import UserDropdown from "./UserDropdown";

export default function Navbar() {
  // const { data: session } = useSession();
  const session = true; // if testing without NextAuth

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <Image
              src={"/logo.png"}
              alt="MygadgetNepal"
              height={30}
              width={30}
            />
          </Link>

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

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <Input type="search" placeholder="Search for gadgets..." className="w-full" />
        </div>

        {/* Right: Cart + Auth + Mobile */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link href="/cart">
              <LucideShoppingBag className="w-5 h-5" />
          </Link>

          {/* Auth Section */}
          {session ?  <UserDropdown/>: (
            <button
              onClick={() => signIn("google")}
              className="hidden md:inline-flex"
            >
              <PiSignInBold className="text-xl" />
            </button>
          )}

          {/* Mobile */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
