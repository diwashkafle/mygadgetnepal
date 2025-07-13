"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  quantity = 1,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleClick = () => {
    if (!productId || !name || !price || !image) {
      toast.error("Missing product info");
      return;
    }

    addToCart({
      productId,
      name,
      price,
      image,
      quantity,
    });

    toast.success("Added to cart");
  };

  return (
    <Button onClick={handleClick} variant="default">
      <ShoppingCart className="w-4 h-4 mr-2" />
      Add to Cart
    </Button>
  );
}
