import BannerForm from '@/components/admin-dashboard/BannerForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold">Edit Banner</h1>
      <BannerForm mode="edit" initialData={banner} />
    </div>
  );
}
