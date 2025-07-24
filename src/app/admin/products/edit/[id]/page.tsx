import { notFound } from "next/navigation";
import ProductForm, { ProductData, Category } from "@/components/admin-dashboard/ProductForm";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const [productRes, categoryRes, subcategoryRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${productId}`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subcategory`, { cache: "no-store" }),
  ]);

  if (!productRes.ok || !categoryRes.ok || !subcategoryRes.ok) {
    notFound();
  }

  const product = await productRes.json();
  const categories = await categoryRes.json();
  const subcategories: Subcategory[] = await subcategoryRes.json();

  const formattedProduct: ProductData = {
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    price: product.price.toString(),
    crossedPrice: product.crossedPrice.toString(),
    stock: product.stock.toString(),
    status: product.status,
    description: product.description,
    images: product.images,
    specifications: product.specifications || [],
    variants: product.variants || [],
  };

  return (
    <ProductForm 
      categories={categories as Category[]}
      subcategories={subcategories}
      mode="edit"
      initialData={formattedProduct}
    />
  );
}
