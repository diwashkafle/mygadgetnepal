'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { uploadToFirebase } from '@/lib/firebase/uploadToFirebase';
import { Banner } from '@prisma/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Trash } from 'lucide-react';
import { deleteFromFirebase } from '@/lib/firebase/deleteFormFirebase';
import { extractFirebasePath } from '@/lib/firebase/extractFromFirebase';

interface BannerFormProps {
  mode: 'add' | 'edit';
  initialData?: Banner;
  onSubmitSuccess?: () => void;
}

export default function BannerForm({ mode, initialData, onSubmitSuccess }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);

  const [form, setForm] = useState({
    title: '',
    image: null as File | string | null,
    ctaText: '',
    ctaLink: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        image: initialData.image,
        ctaText: initialData.ctaText,
        ctaLink: initialData.ctaLink,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.image;

      if (form.image instanceof File) {
        if (mode === 'edit' && typeof initialData?.image === 'string') {
          const oldPath = extractFirebasePath(initialData.image);
          if (oldPath) await deleteFromFirebase(oldPath);
        }
        imageUrl = await uploadToFirebase(form.image);
      }

      if (mode === 'edit' && imageDeleted && typeof initialData?.image === 'string') {
        const oldPath = extractFirebasePath(initialData.image);
        if (oldPath) await deleteFromFirebase(oldPath);
        imageUrl = null;
      }

      const payload = {
        ...form,
        image: imageUrl,
      };

      const res = await fetch(
        mode === 'edit' ? `/api/banner/${initialData?.id}` : '/api/banner',
        {
          method: mode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Something went wrong');

      toast.success(mode === 'edit' ? 'Banner updated' : 'Banner uploaded');
      if (onSubmitSuccess) onSubmitSuccess();
      else router.push('/admin/banner');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-medium mb-1">Banner Title</label>
        <Input
          placeholder="e.g., Dashain Offer | Galaxy Launch"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Banner Image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setForm({ ...form, image: file });
              setImageDeleted(false);
            }
          }}
        />

        {form.image && (
          <div className="mt-4 flex flex-col space-y-10 justify-between">
            <div>
            <Image
              src={typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image)}
              alt="Banner preview"
              height={300}
              width={300}
              className="object-cover"
            />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setForm({ ...form, image: null });
                setImageDeleted(true);
              }}
              className="p-1 h-10 w-8 flex justify-center transition-all items-center duration-200 ease-in rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <Trash color="red" size={20} />
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x300 px</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">CTA Button Text</label>
          <Input
            placeholder='e.g., "Shop Now"'
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Link</label>
          <Input
            placeholder='e.g., "/categories/smartphones"'
            value={form.ctaLink}
            onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.isActive}
          onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
        />
        <span>{form.isActive ? 'Active' : 'Inactive'}</span>
      </div>

      <h1>Preview</h1>

     {
      form.image &&  <div className="relative w-full aspect-[4/1] sm:aspect-[24/9] md:aspect-[32/9] rounded-md overflow-hidden shadow-md">
      <Image
        src={typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image)}
        alt={form.title}
        fill
        className=" object-cover "
      />
    </div> 
     }

      <div className="flex gap-4 flex-wrap">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {mode === 'edit' ? 'Updating...' : 'Uploading...'}
            </>
          ) : mode === 'edit' ? 'Update Banner' : 'Upload Banner'}
        </Button>
        {mode === 'edit' && (
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/banner')}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
