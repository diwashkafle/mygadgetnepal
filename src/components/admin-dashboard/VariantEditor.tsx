"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { VariantGroup } from "@/Types/adminComponentTypes";
import { uploadImagesToImageKit } from "@/lib/imageKit/uploadImagetoImageKit"; // make sure this exists
import Image from "next/image";
import { ChangeEvent } from "react";

type Props = {
  variants: VariantGroup[];
  onChange: (updated: VariantGroup[]) => void;
};

export default function VariantEditor({ variants, onChange }: Props) {
  const update = (updated: VariantGroup[]) => onChange(updated);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    vIdx: number,
    tIdx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const [url] = await uploadImagesToImageKit([file]);
    const updated = [...variants];

    const variantType = updated[vIdx].types[tIdx];

    if (!variantType.images) {
      variantType.images = [];
    }

    variantType.images.push({
      url,
      alt: `Image ${variantType.value}`,
    });

    update(updated);
  };

  const handleRemoveImage = (
    vIdx: number,
    tIdx: number,
    imgIdx: number
  ) => {
    const updated = [...variants];
    const variantType = updated[vIdx].types[tIdx];

    if (variantType.images) {
      variantType.images.splice(imgIdx, 1);
    }

    update(updated);
  };

  return (
    <div className="space-y-4">
      {variants.map((variant, vIdx) => (
        <div key={vIdx} className="border p-4 rounded space-y-3">
          <Input
            placeholder="Variant Name (e.g., Color, Storage)"
            value={variant.name}
            onChange={(e) => {
              const updated = [...variants];
              updated[vIdx].name = e.target.value;
              update(updated);
            }}
          />

          {/* Variant type selector */}
          <div>
            <label className="text-sm font-medium block mb-1">Variant Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={variant.type}
              onChange={(e) => {
                const value = e.target.value as "price" | "color";
                const updated = [...variants];
                updated[vIdx].type = value;
                updated[vIdx].types =
                  value === "price"
                    ? [{ value: "", price: 0 }]
                    : [{ value: "", images: [] }];
                update(updated);
              }}
            >
              <option value="price">Value + Price</option>
              <option value="color">Color + Images</option>
            </select>
          </div>

          {/* Variant entries */}
          {variant.types.map((type, tIdx) => (
            <div key={tIdx} className="border p-3 rounded space-y-2 bg-gray-50">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder={
                    variant.type === "color" ? "Color (e.g., Red)" : "Value"
                  }
                  value={type.value}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[vIdx].types[tIdx].value = e.target.value;
                    update(updated);
                  }}
                />
                {variant.type === "price" && (
                  <Input
                    type="number"
                    placeholder="Price"
                    value={type.price ?? ""}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[vIdx].types[tIdx].price = Number(e.target.value);
                      update(updated);
                    }}
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = [...variants];
                    updated[vIdx].types.splice(tIdx, 1);
                    update(updated);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              {/* Image uploader for color */}
              {variant.type === "color" && (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, vIdx, tIdx)}
                  />

                  {/* Preview uploaded images */}
                  <div className="flex flex-wrap gap-3">
                    {type.images?.map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative w-20 h-20 rounded overflow-hidden border"
                      >
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(vIdx, tIdx, imgIdx)
                          }
                          className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-[2px] text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add type */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const updated = [...variants];
                updated[vIdx].types.push(
                  variant.type === "price"
                    ? { value: "", price: 0 }
                    : { value: "", images: [] }
                );
                update(updated);
              }}
            >
              + Add {variant.type === "price" ? "Value + Price" : "Color"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const updated = [...variants];
                updated.splice(vIdx, 1);
                update(updated);
              }}
            >
              Remove Variant Group
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          update([
            ...variants,
            {
              name: "",
              type: "price",
              types: [{ value: "", price: 0 }],
            },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Variant Group
      </Button>
    </div>
  );
}
