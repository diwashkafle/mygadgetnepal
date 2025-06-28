"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import toast from "react-hot-toast";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { uploadToFirebase } from "@/lib/firebase/uploadToFirebase";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  crossedPrice: number;
  stock: number;
  status: string;
  categoryId: string;
  specifications: { key: string; value: string }[];
  variants: { name: string; values: string[] }[];
  images: string[];
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Omit<Product, "id"> & { newImages: File[] }>({
    name: "",
    categoryId: "",
    price: 0,
    crossedPrice: 0,
    stock: 0,
    status: "Draft",
    description: "",
    specifications: [{ key: "", value: "" }],
    variants: [{ name: "", values: [""] }],
    images: [],
    newImages: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch product and categories
  useEffect(() => {
    if (!id) return;

    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((product: Product) => {
        setForm((prev) => ({
          ...prev,
          name: product.name,
          categoryId: product.categoryId,
          price: product.price,
          crossedPrice: product.crossedPrice,
          stock: product.stock,
          status: product.status,
          description: product.description,
          specifications: product.specifications,
          variants: product.variants,
          images: product.images,
          newImages: [],
        }));
      });

    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Upload new images if added
      const uploadedNewImageUrls: string[] = [];
      for (const file of form.newImages) {
        const url = await uploadToFirebase(file);
        uploadedNewImageUrls.push(url);
      }

      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        price: form.price,
        crossedPrice: form.crossedPrice,
        stock: form.stock,
        status: form.status,
        description: form.description,
        specifications: form.specifications,
        variants: form.variants,
        images: [...form.images, ...uploadedNewImageUrls], // existing + new
      };

      const res = await fetch(`/api/product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product.");

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      {/* Basic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <Label>Price</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
          />

          <Label>Crossed Price</Label>
          <Input
            type="number"
            value={form.crossedPrice}
            onChange={(e) => setForm({ ...form, crossedPrice: parseFloat(e.target.value) })}
          />

          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
          />

          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Label>Category</Label>
          <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description and Images */}
        <div className="space-y-4">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <Label>Existing Images</Label>
          <div className="flex gap-2 flex-wrap">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <Image src={url} fill className="object-cover rounded" alt={`img-${i}`} />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...form.images];
                    updated.splice(i, 1);
                    setForm({ ...form, images: updated });
                  }}
                  className="absolute top-1 right-1"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Label>Add More Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setForm({ ...form, newImages: [...form.newImages, ...files] });
            }}
          />
        </div>
      </div>

      {/* Specs */}
      <div className="mt-10">
        <h3 className="font-semibold text-lg mb-2">Specifications</h3>
        {form.specifications.map((spec, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Key"
              value={spec.key}
              onChange={(e) => {
                const updated = [...form.specifications];
                updated[index].key = e.target.value;
                setForm({ ...form, specifications: updated });
              }}
            />
            <Input
              placeholder="Value"
              value={spec.value}
              onChange={(e) => {
                const updated = [...form.specifications];
                updated[index].value = e.target.value;
                setForm({ ...form, specifications: updated });
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => {
              const updated = [...form.specifications];
              updated.splice(index, 1);
              setForm({ ...form, specifications: updated });
            }}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => setForm({ ...form, specifications: [...form.specifications, { key: "", value: "" }] })}
        >
          + Add Spec
        </Button>
      </div>

      {/* Variants */}
      <div className="mt-10">
        <h3 className="font-semibold text-lg mb-2">Variants</h3>
        {form.variants.map((variant, vIdx) => (
          <div key={vIdx} className="border p-4 rounded space-y-2">
            <Input
              placeholder="Variant Name"
              value={variant.name}
              onChange={(e) => {
                const updated = [...form.variants];
                updated[vIdx].name = e.target.value;
                setForm({ ...form, variants: updated });
              }}
            />
            {variant.values.map((val, valIdx) => (
              <div key={valIdx} className="flex items-center gap-2 mt-2">
                <Input
                  placeholder={`Value ${valIdx + 1}`}
                  value={val}
                  onChange={(e) => {
                    const updated = [...form.variants];
                    updated[vIdx].values[valIdx] = e.target.value;
                    setForm({ ...form, variants: updated });
                  }}
                />
                {variant.values.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => {
                    const updated = [...form.variants];
                    updated[vIdx].values.splice(valIdx, 1);
                    setForm({ ...form, variants: updated });
                  }}>
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const updated = [...form.variants];
                updated[vIdx].values.push("");
                setForm({ ...form, variants: updated });
              }}
            >
              + Add Value
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const updated = [...form.variants];
                updated.splice(vIdx, 1);
                setForm({ ...form, variants: updated });
              }}
            >
              Remove Variant
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => setForm({ ...form, variants: [...form.variants, { name: "", values: [""] }] })}
        >
          + Add Variant Group
        </Button>
      </div>

      {/* Submit */}
      <div className="mt-10">
        <Button className="w-full md:w-auto" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </div>
  );
}
