"use client";

import Link from "next/link";

import { Home, Compass, Heart } from "lucide-react";
import CartIconWithBadge from "./CartIcon";

export default function MobileNavBar() {

  

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden">
      <div className="flex justify-around items-center h-14">
        <Link href="/" className="flex flex-col items-center text-sm">
          <Home className="h-5 w-5" />
          <h1>Home</h1>
        </Link>

        <Link href="/categories" className="flex flex-col items-center text-sm">
          <Compass className="h-5 w-5" />
          <h1>Explore</h1>
        </Link>

         <CartIconWithBadge />

         <Link href="/favourites" className="flex flex-col items-center text-sm">
          <Heart className="h-5 w-5" />
          <h1>Favourites</h1>
        </Link>
       
      </div>
    </nav>
  );
}
