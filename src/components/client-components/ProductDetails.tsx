"use client";

import { useState } from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { VariantGroup, SpecificationGroup } from "@/Types/adminComponentTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductReview, { Review } from "@/components/client-components/ProductReview";

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

const reviews: Review[] = [
  {
    rating: 5,
    comment: "Best gadget I’ve ever used!",
    user: "Alex",
  },
  {
    rating: 4,
    comment: "Great but could be cheaper.",
    user: "Sam",
  },
];

export default function ProductDetails({ product }: ProductProps) {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState("specs");
  const [finalPrice, setFinalPrice] = useState(product.price);


  const variants = product.variants || [];
  const specifications = product.specifications || [];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = [
      ...cart,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        variants: selectedVariants,
      },
    ];
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleAddToFavorites = () => {
    const prev = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = [...new Set([...prev, product.id])];
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleVariantSelect = (variantName: string, selectedValue: string) => {
    setSelectedVariants((prev) => {
      const updated = {
        ...prev,
        [variantName]: selectedValue,
      };
  
      // Price logic
      const selectedPrices: number[] = [];
  
      product.variants.forEach((variant) => {
        const value = updated[variant.name];
        const matched = variant.types.find((type) => type.value === value);
        if (matched?.price) selectedPrices.push(matched.price);
      });
  
      const newPrice = selectedPrices.length > 0 ? selectedPrices[0] : product.price;
      setFinalPrice(newPrice);
  
      return updated;
    });
  };
  

  return (
    <div className="space-y-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square w-full rounded-md overflow-hidden border">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-primary">Rs. {finalPrice}</p>
            {product.crossedPrice > product.price && (
              <p className="line-through text-muted-foreground">Rs. {product.crossedPrice}</p>
            )}
          </div>

          <p
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          {/* Variant selectors */}
          {variants.length > 0 && (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.name}>
                  <label className="block text-sm font-medium mb-2">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.types.map((type) => {
                      const isSelected = selectedVariants[variant.name] === type.value;
                      return (
                        <button
                          key={type.value}
                          onClick={() =>
                            handleVariantSelect(
                              variant.name, type.value
                            )
                          }
                          className={`px-3 py-1 rounded border text-sm transition ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {type.value} {type.price?.toString.length === 0 ? " " : "- Rs " + type.price}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
            <button
              onClick={handleAddToFavorites}
              className="border rounded px-4 py-2 flex items-center justify-center gap-2 text-sm w-full hover:bg-gray-100"
            >
              <FaRegHeart />
              <span>Add to Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="specs" value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="mb-6">
          <TabsTrigger className="cursor-pointer" value="specs">Specifications</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="specs">
          {specifications.length > 0 ? (
            <div className="space-y-6">
              {specifications.map((group, groupIdx) => (
                <div key={groupIdx} className="border rounded p-4 bg-white">
                  <h3 className="font-semibold text-base mb-2">{group.title}</h3>
                  <ul className="text-sm space-y-2">
                    {group.entries.map((spec, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between border-b py-1"
                      >
                        <span className="text-muted-foreground">{spec.key}</span>
                        <span className="font-medium">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No specifications available.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
        <ProductReview reviews={reviews} productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
