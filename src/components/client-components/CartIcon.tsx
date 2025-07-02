
"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CartIcon() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <Badge
          className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs bg-red-600 text-white"
        >
          {totalItems}
        </Badge>
      )}
    </Link>
  );
}
