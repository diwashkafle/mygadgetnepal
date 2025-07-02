"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { VariantGroup } from "@/Types/adminComponentTypes"; // adjust import path

type Props = {
  variants: VariantGroup[];
  onChange: (updated: VariantGroup[]) => void;
};

export default function VariantEditor({ variants, onChange }: Props) {
  const update = (updated: VariantGroup[]) => onChange(updated);

  return (
    <div className="space-y-4">
      {variants?.map((variant, vIdx) => (
        <div key={vIdx} className="border p-4 rounded space-y-2">
          <Input
            placeholder="Variant Name (e.g., Color, Storage)"
            value={variant.name}
            onChange={(e) => {
              const updated = [...variants];
              updated[vIdx].name = e.target.value;
              update(updated);
            }}
          />

          <div>
            <label className="text-sm font-medium block mb-1">Variant Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={variant.type}
              onChange={(e) => {
                const value = e.target.value as "price" | "color";
                const updated = [...variants];
                updated[vIdx].type = value;
                updated[vIdx].types = value === "price"
                  ? [{ value: "", price: 0 }]
                  : [{ value: "" }];
                update(updated);
              }}
            >
              <option value="price">Value + Price</option>
              <option value="color">Color Only</option>
            </select>
          </div>

          {variant?.types?.map((type, tIdx) => (
            <div key={tIdx} className="flex gap-2 items-center">
              <Input
                placeholder={variant.type === "color" ? "Color" : "Value"}
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
                  value={type.price || ""}
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
          ))}

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const updated = [...variants];
                updated[vIdx].types.push(
                  variant.type === "price"
                    ? { value: "", price: 0 }
                    : { value: "" }
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
              Remove Variant
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
