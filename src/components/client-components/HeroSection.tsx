'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
};

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner");
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Banner fetch failed:", err);
      }
    };

    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[400px] mb-6 rounded-md overflow-hidden shadow-md">
        <Image

            src={ "/fallbackBanner.svg"}
            alt={"Banner"}
            fill
            className=" object-cover "
        
/> 
      </div>
)
  }

  return (
    <div className="w-full overflow-hidden relative aspect-[16/9] bg-neutral-900">
      {banners.map((banner) => (
        <div key={banner.id} className="relative w-full h-[400px] mb-6 rounded-md overflow-hidden shadow-md">
          <Image
            src={banner.image || "/fallbackBanner.jpg"}
            alt={banner.title}
            fill
            className="object-cover"
            onError={(e)=>{
              e.currentTarget.src="/fallbackBanner.jpg"
            }}
          />

          <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-start text-white p-10">
            <h1 className="text-3xl md:text-4xl font-bold">{banner.title}</h1>
            <p className="mt-2 text-base md:text-lg max-w-xl">{banner.subtitle}</p>
            {banner.ctaLink && (
              <Link href={banner.ctaLink}>
                <Button className="mt-4 text-white bg-primary hover:bg-primary/90">
                  {banner.ctaText || "Shop Now"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
