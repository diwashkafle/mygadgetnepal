export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductWithVariantsAndSpecs {
  id: string;
  name: string;
  price: number;
  crossedPrice: number;
  description: string;
  images: string[];
  stock: number;
  variants: VariantGroup[];
  specifications: SpecificationGroup[];
}


import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/client-components/ProductDetails";
import { SpecificationGroup, VariantGroup } from "@/Types/adminComponentTypes";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("Param type", typeof params);
  const id = (await Promise.resolve(params)).id;
  const rawProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!rawProduct) return notFound();

  const variants = rawProduct.variants as unknown as VariantGroup[];
  const specifications = rawProduct.specifications as unknown as SpecificationGroup[];

  const product: ProductWithVariantsAndSpecs = {
    id: rawProduct.id,
    name: rawProduct.name,
    price: rawProduct.price,
    crossedPrice: rawProduct.crossedPrice,
    description: rawProduct.description,
    images: rawProduct.images,
    stock: rawProduct.stock,
    variants,
    specifications,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 ">
      <ProductDetails product={product} />
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}
