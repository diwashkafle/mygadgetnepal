
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

type Product = {
  id: string;
  name: string;
  price: number;
  crossedPrice: number;
  images: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Link href={`/products/${product.id}`}>
        <div className=" flex justify-center w-full aspect-[4/3] overflow-hidden bg-white">
        <Image
  src={product.images[0]}
  alt={product.name}
  width={300}
  height={300}
  className="object-contain"
/>
        </div>
        <div className="p-4 space-y-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-primary">
              Rs. {product.price}
            </p>
            {product.crossedPrice > product.price && (
              <p className="text-sm line-through text-muted-foreground">
                Rs. {product.crossedPrice}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          className="w-full mt-2"
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.images[0],
            })
          }
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
