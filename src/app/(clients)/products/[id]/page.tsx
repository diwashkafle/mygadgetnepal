
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/client-components/ProductDetails";
import { SpecificationGroup, VariantGroup } from "@/Types/adminComponentTypes";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  const variants = (product.variants ?? []) as VariantGroup[];
  const specifications = (product.specifications ?? []) as SpecificationGroup[];
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      {/* Left: product image */}
      <div className="relative w-full aspect-[4/3] rounded border overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-4"
        />
      </div>

      {/* Right: client-side interactive section */}
      <ProductDetails
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          crossedPrice: product.crossedPrice,
          description: product.description,
          images: product.images,
          stock: product.stock,
          variants,
          specifications,
        }}
      />
    </div>
  );
}
