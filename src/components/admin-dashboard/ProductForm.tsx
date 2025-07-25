'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { uploadImagesToImageKit } from '@/lib/imageKit/uploadImagetoImageKit';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SpecificationEditor from './SpecificationEditor';
import VariantEditor from './VariantEditor';
import { SpecificationGroup, VariantGroup } from '@/Types/adminComponentTypes';

export type Category = {
  id: string;
  name: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

export type ProductData = {
  id?: string;
  name: string;
  categoryId: string;
  subcategoryId?: string | null;
  price: number;
  crossedPrice: number;
  stock: number;
  status: string;
  description: string;
  images: (string | File)[];
  specifications: SpecificationGroup[];
  variants: VariantGroup[];
};

export type ProductFormProps = {
  categories: Category[];
  subcategories: Subcategory[];
  mode: 'add' | 'edit';
  initialData?: ProductData;
};

export default function ProductForm({
  categories,
  subcategories,
  mode,
  initialData,
}: ProductFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId || '',
    price: initialData?.price || '',
    crossedPrice: initialData?.crossedPrice || '',
    stock: initialData?.stock || '',
    status: initialData?.status || 'Draft',
    description: initialData?.description || '',
    images: initialData?.images || [],
    specs: initialData?.specifications || [
      { title: '', entries: [{ key: '', value: '' }] },
    ],
    variants: initialData?.variants || [
      { name: '', type: 'price', types: [{ value: '', price: 0 }] },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ProductData | null>(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  useEffect(() => {
    if (form.categoryId) {
      setFilteredSubcategories(
        subcategories?.filter((sub) => sub.categoryId === form.categoryId) || []
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [form.categoryId, subcategories]);

  const router = useRouter();

  useEffect(() => {
    const objectUrls = form.images
      .filter((img): img is File => img instanceof File)
      .map((file) => URL.createObjectURL(file));

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.images]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (
        !form.name ||
        !form.categoryId ||
        !form.price ||
        !form.crossedPrice ||
        !form.stock ||
        !form.status ||
        !form.description ||
        form.images.length === 0
      ) {
        toast.error('Fill all fields and upload at least one image.');
        setIsSubmitting(false);
        return;
      }

      const imageUrls: string[] = [];

      for (const img of form.images) {
        if (typeof img === 'string') {
          imageUrls.push(img);
        } else if (img instanceof File) {
          const uploaded = await uploadImagesToImageKit([img]);
          const urls = uploaded.map((u) => u.url);
          imageUrls.push(...urls);
        }
      }

      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || null,
        price: Number(form.price),
        crossedPrice: Number(form.crossedPrice),
        stock: Number(form.stock),
        status: form.status,
        description: form.description,
        images: imageUrls,
        specifications: form.specs,
        variants: form.variants,
      };

      const endpoint = mode === 'add' ? '/api/product' : `/api/product/${initialData?.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, force: false }),
      });

      if (res.status === 409) {
        setPendingPayload(payload);
        setShowDuplicateWarning(true);
        setIsSubmitting(false);
      }

      if (!res.ok) {
        toast.error('Error submitting product');
      } else {
        toast.success(`Product ${mode === 'add' ? 'added' : 'updated'} successfully`);
        if (mode === 'edit') {
          router.push('/admin/products');
        } else {
          setForm({
            name: '',
            categoryId: '',
            subcategoryId: '',
            price: '',
            crossedPrice: '',
            stock: '',
            status: 'Draft',
            description: '',
            images: [],
            specs: [
              { title: '', entries: [{ key: '', value: '' }] },
            ],
            variants: [
              { name: '', type: 'price', types: [{ value: '', price: 0 }] },
            ],
          });
        }
      }
    } catch (err) {
      toast.error('Something went wrong.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Product Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Label>Price</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <Label>Crossed Price</Label>
          <Input
            type="number"
            value={form.crossedPrice}
            onChange={(e) => setForm({ ...form, crossedPrice: e.target.value })}
          />

          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Label>Category</Label>
          <Select
            value={form.categoryId}
            onValueChange={(v) => {
              setForm({ ...form, categoryId: v, subcategoryId: '' });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {form.categoryId && (
            <>
              <Label>Subcategory</Label>
              <Select
                value={form.subcategoryId}
                onValueChange={(v) => setForm({ ...form, subcategoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                  {filteredSubcategories.length === 0 && (
                    <SelectItem disabled value="none">
                      No subcategories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Label>Description</Label>
          <Textarea
            rows={8}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Label>Images</Label>
          {form.images.map((img, idx) => {
            let url = '';
            if (img instanceof File) {
              url = URL.createObjectURL(img);
            } else if (typeof img === 'string') {
              url = img;
            }
            return (
              <div key={idx} className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const updated = [...form.images];
                      updated[idx] = file;
                      setForm({ ...form, images: updated });
                    }
                  }}
                />
                {url && (
                  <div className="relative w-24 h-24 rounded overflow-hidden">
                    <Image
                      src={url}
                      alt={`Image ${idx}`}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...form.images];
                    updated.splice(idx, 1);
                    setForm({ ...form, images: updated });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          {form.images.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm({ ...form, images: [...form.images, ''] })}
            >
              + Add Image
            </Button>
          )}
        </div>
      </div>

      <div className="my-4 flex flex-col space-y-6">
        <SpecificationEditor
          specifications={form.specs}
          onChange={(specs) => setForm({ ...form, specs })}
        />
        <VariantEditor
          variants={form.variants}
          onChange={(variants) => setForm({ ...form, variants })}
        />
      </div>

      {/* Submit */}
      <div className="mt-10 space-x-5">
        <Button onClick={handleSubmit} className="cursor-pointer" disabled={isSubmitting}>
          {isSubmitting
            ? 'Submitting...'
            : mode === 'add'
            ? 'Submit Product'
            : 'Update Product'}
        </Button>
        {mode === 'edit' && (
          <Button
            className="cursor-pointer"
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Duplicate Warning Modal */}
      <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Product Detected</AlertDialogTitle>
            <AlertDialogDescription>
              A product with the same name and category already exists. Upload anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                toast('Product upload cancelled.');
                setShowDuplicateWarning(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setIsSubmitting(true);
                setShowDuplicateWarning(false);
                try {
                  const res = await fetch('/api/product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...pendingPayload, force: true }),
                  });
                  if (!res.ok) {
                    toast.error('Forced product upload failed.');
                    return;
                  }
                  toast.success('Product uploaded anyway!');
                  setForm({
                    name: '',
                    categoryId: '',
                    subcategoryId: '',
                    price: '',
                    crossedPrice: '',
                    stock: '',
                    status: 'Draft',
                    description: '',
                    images: [],
                    specs: [{ title: '', entries: [{ key: '', value: '' }] }],
                    variants: [{ name: '', type: 'price', types: [{ value: '', price: 0 }] }],
                  });
                } catch (err) {
                  toast.error('Error during forced upload.');
                  console.error(err);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Upload Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}