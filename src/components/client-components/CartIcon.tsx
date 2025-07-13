"use client";

import { useCartStore } from "@/store/cart-store";
import { LucideShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function CartIconWithBadge() {
  const cart = useCartStore();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setQuantity(cart.getTotalQuantity());
  }, [cart.items]); // triggers re-render on cart update

  return (
    <Link href="/cart" className="relative flex flex-col items-center">
      <LucideShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
      {quantity > 0 && (
        <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
          {quantity}
        </span>
      )}
      <h1 className="flex md:hidden text-sm">Cart</h1>
    </Link>
  );
}
