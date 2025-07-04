"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type Banner = {
  id: string;
  title: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number;
};

export default function AdminBannerListPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBanners(data);
        } else {
          console.error("Unexpected response format:", data);
          setBanners([]);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Banners</h2>
        <Link href="/admin/banner/add-new">
          <Button className="cursor-pointer">Add New Banner</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : banners.length === 0 ? (
        <p>No banners found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="border rounded overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
              <Image width={200} height={200} src={banner.image} alt={banner.title} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold">{banner.title}</h3>
                <p className="text-sm text-muted-foreground">{banner.ctaText}</p>
                <div className="flex justify-between">
                  <Link href={`/admin/banner/${banner.id}`}>
                    <Button className=" cursor-pointer" variant="secondary">Edit</Button>
                  </Link>
                  <form
                    method="POST"
                    action={`/api/banner/${banner.id}`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetch(`/api/banner/${banner.id}`, { method: "DELETE" }).then(() =>
                        setBanners((prev) => prev.filter((b) => b.id !== banner.id))
                      );
                    }}
                  >
                    <Button className=" cursor-pointer" variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
