'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    subtitle: '',
    image: null as File | string | null,
    ctaText: '',
    ctaLink: '',
    startDate: '',
    endDate: '',
    isActive: true,
    priority: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        subtitle: initialData.subtitle,
        image: initialData.image,
        ctaText: initialData.ctaText,
        ctaLink: initialData.ctaLink,
        startDate: new Date(initialData.startDate).toISOString().slice(0, 10),
        endDate: new Date(initialData.endDate).toISOString().slice(0, 10),
        isActive: initialData.isActive,
        priority: initialData.priority,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.image;

      // New image uploaded
      if (form.image instanceof File) {
        if (mode === 'edit' && typeof initialData?.image === 'string') {
          const oldPath = extractFirebasePath(initialData.image);
          if (oldPath) await deleteFromFirebase(oldPath);
        }
        imageUrl = await uploadToFirebase(form.image);
      }

      // Image deleted in edit mode
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
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <Textarea
          placeholder="Highlight details or occasion..."
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
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
              setImageDeleted(false); // reset deletion flag
            }
          }}
        />

        {form.image && (
          <div className="mt-4 flex justify-between">
            <Image
              src={
                typeof form.image === 'string'
                  ? form.image
                  : URL.createObjectURL(form.image)
              }
              alt="Banner preview"
              width={500}
              height={250}
              className="rounded border"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setForm({ ...form, image: null });
                setImageDeleted(true);
              }}
              className="p-1 h-10 transition-all items-center duration-200 ease-in rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <Trash color="red" size={20} />
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">
          Recommended: 1600x900 px (16:9 aspect ratio)
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Input
            type="number"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: parseInt(e.target.value) || 0 })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher priority = shown first
          </p>
        </div>
        <div className="flex items-center gap-3 mt-6 md:mt-0">
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm({ ...form, isActive: checked })
            }
          />
          <span>{form.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {mode === 'edit' ? 'Updating...' : 'Uploading...'}
            </>
          ) : mode === 'edit' ? (
            'Update Banner'
          ) : (
            'Upload Banner'
          )}
        </Button>
        {mode === 'edit' && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/banner')}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
