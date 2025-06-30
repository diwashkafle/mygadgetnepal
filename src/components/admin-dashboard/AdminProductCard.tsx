"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  category: {
    name: string;
  };
};

type Props = {
  product: Product;
  onDelete: (id: string) => void;
  deletingId: string | null;
};

export default function ProductCard({ product, onDelete, deletingId }: Props) {
  return (
    <div className="border rounded p-4 space-y-2 shadow-sm">
      {product.images?.[0] ? (
        <div className="relative w-full h-48 mb-2 rounded overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/fallback.jpg";
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 mb-2 bg-gray-100 flex items-center justify-center rounded">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          Category: {product.category.name}
        </p>
        <p className="text-sm">Price: Rs. {product.price}</p>
        <p className="text-sm">Stock: {product.stock}</p>
        <p className="text-xs text-gray-500 italic">{product.status}</p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.id)}
          disabled={deletingId === product.id}
        >
          {deletingId === product.id ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
