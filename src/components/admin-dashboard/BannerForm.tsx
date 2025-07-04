'use client'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch'
import Image from 'next/image';
import React, { useState } from 'react'
import { uploadToFirebase } from '@/lib/firebase/uploadToFirebase';
import toast from "react-hot-toast";
import { Button } from '@/components/ui/button';

const BannerPage = () => {
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        image: null as File | string | null,
        ctaText: "",
        ctaLink: "",
        startDate: "",
        endDate: "",
        isActive: true,
        priority: 0,
      });

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        try {
          let imageUrl = form.image;
          if (form.image instanceof File) {
                imageUrl = await uploadToFirebase(form.image);
          }
      
          const payload = {
            ...form,
            image: imageUrl,
          };
      
          const response = await fetch("/api/banner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) throw new Error("Upload failed");
          toast.success("Banner uploaded");
          setForm({
            title: "",
            subtitle: "",
            image: null,
            ctaText: "",
            ctaLink: "",
            startDate: "",
            endDate: "",
            isActive: true,
            priority: 0,
          });
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        }
      };
      
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          <h1 className="text-2xl font-bold">Upload Promotional Banner</h1>
      
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Banner Title</label>
              <Input
                placeholder="e.g., Dashain Offer | Launching New Galaxy Series"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
      
            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Short Description (optional)
              </label>
              <Textarea
                placeholder="Highlight deals, product info, or festive context..."
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>
      
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Banner Image (Required)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image: file });
                }}
              />
              {form.image && typeof form.image !== "string" && (
                <Image
                  src={URL.createObjectURL(form.image)}
                  alt="preview"
                  width={500}
                  height={250}
                  className="rounded mt-4 border"
                />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Recommended aspect ratio: 16:9 (e.g., 1600x900 px)
              </p>
            </div>
      
            {/* CTA Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  CTA Button Text
                </label>
                <Input
                  placeholder='e.g., "Shop Now", "See Details"'
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                />
              </div>
      
              <div>
                <label className="block text-sm font-medium mb-1">
                  CTA Button Link
                </label>
                <Input
                  placeholder='e.g., "/categories/smartphones"'
                  value={form.ctaLink}
                  onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                />
              </div>
            </div>
      
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
            </div>
      
            {/* Priority + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Input
                  type="number"
                  placeholder="e.g., 10 (higher shows first)"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher priority banners appear first on the homepage.
                </p>
              </div>
      
              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked })
                  }
                />
                <span>{form.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
      
            <Button type="submit" className="w-full md:w-auto">
              Upload Banner
            </Button>
          </form>
        </div>
      );
    }      

export default BannerPage