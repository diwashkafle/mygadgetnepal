"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/client-components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@prisma/client"; // if you're using Prisma Client types
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProductWithReviews extends Product {
  reviews?: { rating: number }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
  }, [minPrice, maxPrice, query]);

  const filteredProducts = products
    .filter((p) => {
      const price = Number(p.price ?? 0);
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      const avgRating =
        Array.isArray(p.reviews) && p.reviews.length > 0
          ? p.reviews.reduce(
              (acc: number, r: { rating: number }) => acc + r.rating,
              0
            ) / p.reviews.length
          : 0;
      const meetsRating = !minRating || avgRating >= Number(minRating);
      const matchesCategory =
        !selectedCategory || p.categoryId === selectedCategory;
      return price >= min && price <= max && meetsRating && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "priceAsc") return (a.price ?? 0) - (b.price ?? 0);
      if (sortOption === "priceDesc") return (b.price ?? 0) - (a.price ?? 0);
      if (sortOption === "latest") {
        const dateA = new Date(a.createdAt ?? "").getTime();
        const dateB = new Date(b.createdAt ?? "").getTime();
        return dateB - dateA;
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 md:py-14 py-4 flex flex-col">
      <div className="md:flex-row flex-col justify-between py-2">
        <div>
        <h1 className="sm:text-2xl mb-5 md:mb-0 sm:font-bold">
          Search results for “{query}”
        </h1>
        </div>

        {/* Sort option at top */}
        <div className="flex justify-between md:justify-end ">
         <div className="flex items-center">
         <div className="flex space-x-2"><ArrowDownUp size={20}/> <h1 className="hidden sm:flex">Sort by :</h1></div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border text-xs md:text-sm p-1 sm:p-2 rounded w-[140px] md:w-48"
          >
            <option value="">Best match</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="latest">Newest</option>
          </select>
         </div>
         <Dialog open={showMobileFilter} onOpenChange={setShowMobileFilter}>
            <DialogTrigger asChild>
              <button className="md:hidden">
                <SlidersHorizontal size={20}/>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-full rounded-t-lg mt-auto w-full p-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="border p-2 rounded w-1/2"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="border p-2 rounded w-1/2"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1★ & up</option>
                    <option value="2">2★ & up</option>
                    <option value="3">3★ & up</option>
                    <option value="4">4★ & up</option>
                    <option value="5">5★</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <button
                  className="bg-black text-white w-full py-2 rounded"
                  onClick={() => {
                    setMinPrice(tempMinPrice);
                    setMaxPrice(tempMaxPrice);
                    setShowMobileFilter(false);
                  }}
                >
                  Apply Filters
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main flex layout for sidebar and content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for filters on desktop */}
        <aside className="w-full md:w-64 border rounded p-4 space-y-4 hidden md:block">
          <h3 className="font-semibold">Filters</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Min"
                className="border p-2 rounded w-1/2"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="border p-2 rounded w-1/2"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
              />
            </div>
            <button
              className="bg-black text-white rounded px-3 py-1 text-sm w-full"
              onClick={() => {
                setMinPrice(tempMinPrice);
                setMaxPrice(tempMaxPrice);
              }}
            >
              Apply
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Rating</label>
            <select
              className="border p-2 rounded w-full"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="1">1 star & up</option>
              <option value="2">2 stars & up</option>
              <option value="3">3 stars & up</option>
              <option value="4">4 stars & up</option>
              <option value="5">5 stars only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* TODO: Add ratings and dynamic categories here later */}
        </aside>
        {/* Main content area */}
        <div className="flex-1">
        <Separator />
          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-[300px] rounded-md" />
                ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-10 py-4">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
