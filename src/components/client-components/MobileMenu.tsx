// components/MobileMenu.tsx

"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CartIcon from "./CartIcon";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function MobileMenu() {
  const { data: session } = useSession();

  return (
    <Sheet>
      {/* Trigger: Hamburger Icon */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Slide-in Content */}
      <SheetContent side="left" className="w-64 flex flex-col space-y-4 pt-8">
        <Link href="/" className="text-lg font-medium">Home</Link>
        <Link href="/categories" className="text-lg font-medium">Categories</Link>
        <Link href="/favorites" className="text-lg font-medium">Favorites</Link>
        <CartIcon />
        {session ? (
          <Link href="/profile" className="text-lg font-medium">Profile</Link>
        ) : (
          <Link href="/api/auth/signin" className="text-lg font-medium">Login</Link>
        )}
      </SheetContent>
    </Sheet>
  );
}
