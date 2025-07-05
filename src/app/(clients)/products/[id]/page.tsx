
import { prisma } from "@/lib/prisma";
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
    <div className="max-w-5xl mx-auto px-4 py-8 ">
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
