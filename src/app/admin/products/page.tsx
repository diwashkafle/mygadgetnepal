"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/admin-dashboard/AdminProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCardSkeleton from "@/components/admin-dashboard/ProductCardSkeleton";
import toast from "react-hot-toast";
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

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 20;

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products?.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold">All Products</h2>

      <div className="flex justify-between">
      <Input
        placeholder="Search products..."
        className="w-full md:w-1/2"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      <Link href={"/admin/add-product"}>
      <Button className="cursor-pointer">
        Add product
      </Button>
      </Link>
      </div>

      {loading ? (
        <ProductCardSkeleton/>
      ) : filteredProducts.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="mt-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
