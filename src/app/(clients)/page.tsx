
import ProductCard from "@/components/client-components/ProductCard";
import { prisma } from "@/lib/prisma"; 
import Hero from "@/components/client-components/HeroSection";
export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      name: true,
      price: true,
      crossedPrice: true,
      images: true,
      stock:true
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <Hero/>
      </div>
      <h1 className="text-2xl font-bold my-2 md:my-4 mb-6">Latest Products</h1>

      <div className="grid grid-cols-4 gap-5 space-y-10 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
