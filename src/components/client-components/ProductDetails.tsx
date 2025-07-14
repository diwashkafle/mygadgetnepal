"use client";

import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { VariantGroup, SpecificationGroup } from "@/Types/adminComponentTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductReview, {
  Review,
} from "@/components/client-components/ProductReview";
import ProductImageGallery from "@/components/client-components/ProductImageGallery";
import AddToCartButton from "./AddtoCartBtn";
import Image from "next/image";

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
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [activeTab, setActiveTab] = useState("specs");
  const [finalPrice, setFinalPrice] = useState(product.price);
  const [galleryImages, setGalleryImages] = useState(product.images);

  const variants = product.variants || [];
  const specifications = product.specifications || [];

  const handleAddToFavorites = () => {
    const prev = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = [...new Set([...prev, product.id])];
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleVariantSelect = (variantName: string, selectedValue: string) => {
    setSelectedVariants((prev) => {
      const updated = { ...prev, [variantName]: selectedValue };

      // Update price
      const selectedPrices: number[] = [];
      product.variants.forEach((variant) => {
        const value = updated[variant.name];
        const matched = variant.types.find((type) => type.value === value);
        if (matched?.price) selectedPrices.push(matched.price);
      });

      const newPrice =
        selectedPrices.length > 0 ? selectedPrices[0] : product.price;
      setFinalPrice(newPrice);

      // Update gallery images for color variant
      const selectedColorVariant = product.variants.find(
        (v) => v.type === "color"
      );
      if (selectedColorVariant) {
        const selectedColor = updated[selectedColorVariant.name];
        const matchedColorType = selectedColorVariant.types.find(
          (t) => t.value === selectedColor
        );
        if (
          matchedColorType &&
          matchedColorType.images &&
          matchedColorType.images.length > 0
        ) {
          const urls = matchedColorType.images.map((img) => img.url);
          setGalleryImages(urls);
        } else {
          setGalleryImages(product.images); // fallback
        }
      }

      return updated;
    });
  };

  return (
    <div className="space-y-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <ProductImageGallery images={galleryImages} alt={product.name} />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-primary">
              Rs. {finalPrice}
            </p>
            {product.crossedPrice > product.price && (
              <p className="line-through text-muted-foreground">
                Rs. {product.crossedPrice}
              </p>
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

          {/* Variant Selectors */}
          {variants.length > 0 && (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.name}>
                  <label className="block text-sm font-medium mb-2">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.types.map((type) => {
                      const isSelected =
                        selectedVariants[variant.name] === type.value;

                      const previewImage =
                        variant.type === "color" &&
                        Array.isArray(type.images) &&
                        type.images.length > 0
                          ? type.images[0].url
                          : null;

                      const baseClasses =
                        "px-3 py-1 rounded border text-sm transition flex items-center gap-2";
                      const selectedClasses =
                        "border-2 border-blue-600 ring-2 ring-blue-200";
                      const unselectedClasses =
                        "border border-gray-300 hover:bg-gray-100";

                      const buttonClassName = `${baseClasses} ${
                        isSelected ? selectedClasses : unselectedClasses
                      }`;

                      return (
                        <button
                          key={type.value}
                          onClick={() =>
                            handleVariantSelect(variant.name, type.value)
                          }
                          className={buttonClassName}
                        >
                          {previewImage && (
                            <Image
                              height={24}
                              width={24}
                              src={previewImage}
                              alt={type.value}
                              className="w-6 h-6 object-cover rounded"
                            />
                          )}
                          <span>{type.value}</span>
                          {typeof type.price === "number" && !isNaN(type.price)
                            ? ` - Rs ${type.price}`
                            : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={finalPrice}
              image={product.images?.[0]}
            />
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
      <Tabs
        defaultValue="specs"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger className="cursor-pointer" value="specs">
            Specifications
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="reviews">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specs">
          {specifications.length > 0 ? (
            <div className="space-y-6">
              {specifications.map((group, groupIdx) => (
                <div key={groupIdx} className="border rounded p-4 bg-white">
                  <h3 className="font-semibold text-base mb-2">
                    {group.title}
                  </h3>
                  <ul className="text-sm space-y-2">
                    {group.entries.map((spec, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between border-b py-1"
                      >
                        <span className="text-muted-foreground">
                          {spec.key}
                        </span>
                        <span className="font-medium">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No specifications available.
            </p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <ProductReview reviews={reviews} productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
