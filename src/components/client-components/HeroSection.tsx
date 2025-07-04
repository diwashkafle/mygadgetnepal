"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Shop Smart. <br />
            Shop <span className="text-primary">MyGadgetNepal</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Get the best deals on gadgets, accessories, and more.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link href="/categories">
              <Button size="lg">Browse Categories</Button>
            </Link>
            <Link href="/#products">
              <Button size="lg" variant="outline">Shop Now</Button>
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 relative w-full max-w-md h-[300px] md:h-[400px]">
          <Image
            src="/hero-product.png" // Replace with your actual image
            alt="Tech Products"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
