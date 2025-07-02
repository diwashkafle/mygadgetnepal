"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { FaRegHeart } from "react-icons/fa";
import { VariantGroup,SpecificationGroup } from "@/Types/adminComponentTypes";
  
  

  
  type ProductProps = {
    product: {
      id: string;
      name: string;
      price: number;
      crossedPrice: number;
      description: string;
      images: string[];
      stock: number;
      variants: VariantGroup[];
      specifications: SpecificationGroup[];
    };
  };
  

export default function ProductDetails({ product }: ProductProps) {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const variants = product.variants || [];
  const specifications = product.specifications || [];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = [...cart, {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      variants: selectedVariants,
    }];
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleAddToFavorites = () => {
    const prev = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = [...new Set([...prev, product.id])];
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold text-primary">Rs. {product.price}</p>
        {product.crossedPrice > product.price && (
          <p className="line-through text-muted-foreground">Rs. {product.crossedPrice}</p>
        )}
      </div>

      <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
        {product.stock > 0 ? "in Stock" : "Out of Stock"}
      </p>

      {/* Variant Dropdowns */}
      {variants.length > 0 && (
        <div className="space-y-4">
          {variants.map((variant: VariantGroup) => (
            <div key={variant.name}>
              <label className="block text-sm font-medium mb-1">{variant.name}</label>
              <Select
  defaultValue={variant?.types?.[0]?.value}
  onValueChange={(value) =>
    setSelectedVariants((prev) => ({
      ...prev,
      [variant.name]: value,
    }))
  }
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder={`Choose ${variant.name}`} />
  </SelectTrigger>
  <SelectContent>
    {variant.types.map((type) => (
      <SelectItem key={type.value} value={type.value}>
        {type.value} - Rs. {type.price}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button onClick={handleAddToCart} className="w-full">Add to Cart</Button>
        <button onClick={handleAddToFavorites} className="border rounded px-4 py-2 flex items-center space-x-1 text-sm w-full hover:bg-gray-100">
        <FaRegHeart />
       <h1> Add to Favorites</h1>
        </button>
      </div>

      <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-6">
        {product.description}
      </div>

{/* Specifications */}
{specifications.length > 0 && (
  <section className="mt-12">
    <h2 className="text-lg font-semibold mb-4">Specifications</h2>
    <div className="space-y-6">
      {specifications.map((group, groupIdx) => (
        <div key={groupIdx} className="border rounded p-4 bg-white">
          <h3 className="font-semibold text-base mb-2">{group.title}</h3>
          <ul className="text-sm space-y-2">
            {group.entries.map((spec, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span className="text-muted-foreground">{spec.key}</span>
                <span className="font-medium">{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
)}
     
    </div>
  );
}
