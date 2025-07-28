"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadImagesToImageKit } from "@/lib/imageKit/uploadImagetoImageKit";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type BannerForm = {
  title: string;
  subtitle: string;
  image: string | File | null;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
};

export default function EditBannerPage() {
  const [form, setForm] = useState<BannerForm>({
    title: "",
    subtitle: "",
    image: null,
    ctaText: "",
    ctaLink: "",
    startDate: "",
    endDate: "",
    isActive: true,
    priority: 0,
  });

  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/banner/${id}`);
        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load banner");
      }
    };

    if (id) fetchBanner();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;

      if (form.image instanceof File) {
        const uploaded = await uploadImagesToImageKit([form.image]);
        imageUrl = uploaded[0]?.url;
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        ...form,
        image: imageUrl,
      };

      const res = await fetch(`/api/banner/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update banner");

      toast.success("Banner updated successfully");
      router.push("/admin/banner");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold">Edit Banner</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Banner Title</label>
          <Input
            placeholder="e.g., Dashain Offer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <Textarea
            placeholder="Banner subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm({ ...form, image: file });
            }}
          />
          {form.image && typeof form.image === "string" && (
            <Image
              src={form.image}
              alt="Banner preview"
              width={500}
              height={250}
              className="rounded mt-4"
            />
          )}
          {form.image && typeof form.image !== "string" && (
            <Image
              src={URL.createObjectURL(form.image)}
              alt="New preview"
              width={500}
              height={250}
              className="rounded mt-4"
            />
          )}
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            placeholder="CTA Button Text"
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
          />
          <Input
            placeholder="CTA Link (e.g., /deals)"
            value={form.ctaLink}
            onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Input
            type="number"
            placeholder="Priority"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: parseInt(e.target.value) || 0 })
            }
          />
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm({ ...form, isActive: checked })
              }
            />
            <span>{form.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
