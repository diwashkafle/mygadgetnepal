"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
  const [isFav, setIsFav] = useState(false); // Temporary favorite toggle

  const toggleFav = () => setIsFav((prev) => !prev);

  return (
    <div className="w-[260px] min-h-[340px] bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group relative">
      {/* Favorite icon */}
      <button
        onClick={toggleFav}
        className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white hover:bg-muted transition"
        title={isFav ? "Remove from Favorite" : "Add to Favorite"}
      >
        {isFav ? (
          <FaHeart className="text-red-500 w-5 h-5" />
        ) : (
          <FaRegHeart className="text-gray-400 w-5 h-5" />
        )}
      </button>

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
          <h3 className="text-sm font-medium line-clamp-2 h-[2.75rem]">
            {product.name}
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
