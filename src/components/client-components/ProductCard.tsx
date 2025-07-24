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
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="w-[260px] h-[380px]  bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group relative">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative w-full aspect-[4/3] bg-white overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain w-full h-full p-2 transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col space-y-2">
          <h3 className="text-sm font-medium h-[44px]">
            {product.name.length > 35
              ? `${product.name.slice(0, 35)}...`
              : product.name}
          </h3>

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

          {/* Stock Status */}
          <p
            className={`text-xs font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <Button
          className="w-full"
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.images[0],
            })
          }
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
