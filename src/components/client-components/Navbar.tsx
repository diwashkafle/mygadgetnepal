"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PiSignInBold } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import MobileMenu from "@/components/client-components/MobileMenu";
import UserDropdown from "@/components/client-components/UserDropdown";
import CartIconWithBadge from "@/components/client-components/CartIcon";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdDashboard } from "react-icons/md";

const ADMIN_EMAILS =
  (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim());

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "";
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  console.log("Session email:", userEmail);
  console.log("Allowed admin emails:", ADMIN_EMAILS);
  console.log("isAdmin:", isAdmin);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchText.trim())}`);
    setSearchText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

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
            <Link href="/" className="hover:text-black/80 transition">Home</Link>
            <Link href="/categories" className="hover:text-black/80 transition">Categories</Link>
            <Link href="/favorites" className="hover:text-black/80 transition">Favorites</Link>
          </nav>
        </div>

        {/* Desktop Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search for gadgets..."
              className="w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-sm bg-black text-white px-3 py-1 rounded"
            >
              Search
            </button>
          </div>
        </div>

        {/* Desktop Right: Cart + User */}
        <div className="hidden md:flex items-center space-x-5">
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium hover:underline cursor-pointer">
              <MdDashboard size={25}/>
            </Link>
          )}
          <CartIconWithBadge />
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <button onClick={handleSignIn} className="inline-flex">
              <PiSignInBold className="text-xl" />
            </button>
          )}
        </div>

        {/* Mobile Right: Search + User */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full h-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs bg-black text-white px-2 py-1 rounded"
            >
              Go
            </button>
          </div>

          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <button onClick={handleSignIn} className="inline-flex">
              <PiSignInBold className="text-xl" />
            </button>
          )}
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
