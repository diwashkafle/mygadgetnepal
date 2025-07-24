import ProductForm, { Category } from "@/components/admin-dashboard/ProductForm";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export default async function AddProductPage() {
  const [catRes, subRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subcategory`, { cache: "no-store" }),
  ]);

  if (!catRes.ok || !subRes.ok) {
    throw new Error("Failed to fetch categories or subcategories");
  }

  const categories: Category[] = await catRes.json();
  const subcategories: Subcategory[] = await subRes.json();

  return (
    <ProductForm
      mode="add"
      categories={categories}
      subcategories={subcategories}
    />
  );
}
