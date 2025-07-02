"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { SpecificationGroup } from "@/Types/adminComponentTypes";

type Props = {
  specifications: SpecificationGroup[];
  onChange: (updated: SpecificationGroup[]) => void;
};

export default function SpecificationEditor({ specifications, onChange }: Props) {
  const update = (updated: SpecificationGroup[]) => onChange(updated);

  return (
    <div className="space-y-4">
      {specifications?.map((group, gIdx) => (
        <div key={gIdx} className="border p-4 rounded space-y-2">
          <Input
            placeholder="Specification Group Title (e.g., Display)"
            value={group.title}
            onChange={(e) => {
              const updated = [...specifications];
              updated[gIdx].title = e.target.value;
              update(updated);
            }}
          />
          {group.entries?.map((entry, eIdx) => (
            <div key={eIdx} className="flex gap-2 items-center">
              <Input
                placeholder="Key"
                value={entry.key}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[gIdx].entries[eIdx].key = e.target.value;
                  update(updated);
                }}
              />
              <Input
                placeholder="Value"
                value={entry.value}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[gIdx].entries[eIdx].value = e.target.value;
                  update(updated);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const updated = [...specifications];
                  updated[gIdx].entries.splice(eIdx, 1);
                  update(updated);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const updated = [...specifications];
                updated[gIdx].entries.push({ key: "", value: "" });
                update(updated);
              }}
            >
              + Add Entry
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const updated = [...specifications];
                updated.splice(gIdx, 1);
                update(updated);
              }}
            >
              Remove Group
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          update([
            ...specifications,
            { title: "", entries: [{ key: "", value: "" }] },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Spec Group
      </Button>
    </div>
  );
}
