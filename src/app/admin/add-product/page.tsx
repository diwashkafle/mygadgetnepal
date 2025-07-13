// "use client";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import toast from "react-hot-toast";

// import { useEffect, useState } from "react";
// import { Plus, Trash } from "lucide-react";
// import Image from "next/image";
// import { Trash2 } from "lucide-react";
// import { uploadToFirebase } from "@/lib/firebase/uploadToFirebase";

// type Category = {
//   id: string;
//   name: string;
// };

// export default function AddProductPage() {
//   const [form, setForm] = useState({
//     name: "",
//     categoryId: "",
//     price: "",
//     crossedPrice: "",
//     stock: "",
//     status: "Draft",
//     description: "",
//     images: [] as File[],
//     specs: [{ key: "", value: "" }],
//     variants: [{ name: "", values: [""] }],
//   });

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isSubmited, setIsSubmited] = useState<boolean>(false)
 
//   useEffect(() => {
//     fetch("/api/category")
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Error fetching categories:", err));
//   }, []);

//   const handleAddSpec = () => {
//     setForm((prev) => ({
//       ...prev,
//       specs: [...prev.specs, { key: "", value: "" }],
//     }));
//   };

//   const handleSpecChange = (
//     index: number,
//     field: "key" | "value",
//     value: string
//   ) => {
//     const newSpecs = [...form.specs];
//     newSpecs[index][field] = value;
//     setForm((prev) => ({ ...prev, specs: newSpecs }));
//   };

//   const handleRemoveSpec = (index: number) => {
//     const newSpecs = [...form.specs];
//     newSpecs.splice(index, 1);
//     setForm((prev) => ({ ...prev, specs: newSpecs }));
//   };

//   const handleAddVariant = () => {
//     setForm((prev) => ({
//       ...prev,
//       variants: [...prev.variants, { name: "", values: [""] }],
//     }));
//   };

//   const handleVariantNameChange = (index: number, value: string) => {
//     const newVariants = [...form.variants];
//     newVariants[index].name = value;
//     setForm((prev) => ({ ...prev, variants: newVariants }));
//   };

//   const handleVariantValueChange = (
//     vIdx: number,
//     valIdx: number,
//     value: string
//   ) => {
//     const newVariants = [...form.variants];
//     newVariants[vIdx].values[valIdx] = value;
//     setForm((prev) => ({ ...prev, variants: newVariants }));
//   };

//   const handleAddVariantValue = (vIdx: number) => {
//     const newVariants = [...form.variants];
//     newVariants[vIdx].values.push("");
//     setForm((prev) => ({ ...prev, variants: newVariants }));
//   };

//   const handleRemoveVariant = (vIdx: number) => {
//     const newVariants = [...form.variants];
//     newVariants.splice(vIdx, 1);
//     setForm((prev) => ({ ...prev, variants: newVariants }));
//   };

//   const handleSubmit = async () => {
//     // To be implemented: API integration
//     console.log(form);
//     setIsSubmited(true)
//     try {
//       if (
//         !form.name ||
//         !form.categoryId ||
//         !form.price ||
//         !form.crossedPrice ||
//         !form.stock ||
//         !form.status ||
//         !form.description ||
//         form.images.length === 0
//       ) {
//         toast.error(
//           "Please fill all required fields and upload at least one image."
//         );
//         return;
//       }

//       const firebaseImageUrls: string[] = [];

//       for (const file of form.images) {
//         if (!file) continue;
//         const url = await uploadToFirebase(file);
//         firebaseImageUrls.push(url);
//       }

//       const payload = {
//         name: form.name,
//         categoryId: form.categoryId,
//         price: form.price,
//         crossedPrice: form.crossedPrice,
//         stock: form.stock,
//         status: form.status,
//         description: form.description,
//         images: firebaseImageUrls,
//         specs: form.specs,
//         variants: form.variants,
//       };

//       const res = await fetch("/api/product", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errMsg = await res.text();
//         console.error(" API Error:", errMsg);
//         toast.error("Failed to add product.");
//         return;
//       }

//       const createdProduct = await res.json();
//       console.log(" Product added:", createdProduct);
//       toast.success("Product added successfully!");
//       setIsSubmited(false)

      // setForm({
      //   name: "",
      //   categoryId: "",
      //   price: "",
      //   crossedPrice: "",
      //   stock: "",
      //   status: "Draft",
      //   description: "",
      //   images: [null as unknown as File],
      //   specs: [{ key: "", value: "" }],
      //   variants: [{ name: "", values: [""] }],
      // });
//     } catch (error) {
//       console.error(" Submission failed:", error);
//       toast.error("Something went wrong while submitting the product.");
//     }
//   };

//   const handleRemoveVariantValue = (vIdx: number, valIdx: number) => {
//   const newVariants = [...form.variants]
//   newVariants[vIdx].values.splice(valIdx, 1)
//   setForm(prev => ({ ...prev, variants: newVariants }))
// }

//   return (
//     <div className="max-w-5xl mx-auto py-10">
//       <h2 className="text-2xl font-bold mb-6">Add New Tech Product</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-4">
//           <Label>Product Name</Label>
//           <Input
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <Label>Price</Label>
//           <Input
//             type="number"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//           />

//           <Label>Crossed Price</Label>
//           <Input
//             type="number"
//             value={form.crossedPrice}
//             onChange={(e) => setForm({ ...form, crossedPrice: e.target.value })}
//           />

//           <Label>Stock</Label>
//           <Input
//             type="number"
//             value={form.stock}
//             onChange={(e) => setForm({ ...form, stock: e.target.value })}
//           />

//           <Label>Status</Label>
//           <Select
//             value={form.status}
//             onValueChange={(v) => setForm({ ...form, status: v })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Published">Published</SelectItem>
//               <SelectItem value="Draft">Draft</SelectItem>
//             </SelectContent>
//           </Select>

//           <Label>Category</Label>
//           <Select onValueChange={(v) => setForm({ ...form, categoryId: v })}>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose Category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-4">
//           <Label>Description</Label>
//           <Textarea
//             rows={8}
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />

//           <Label>Images</Label>

//           <div className="space-y-4">
//             {form.images.map((file, i) => {
//               const objectUrl = file ? URL.createObjectURL(file) : "";
//               return (
//                 <div key={i} className="flex items-center gap-4">
//                   {/* File Input */}
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const selectedFile = e.target.files?.[0];
//                       if (selectedFile) {
//                         const updated = [...form.images];
//                         updated[i] = selectedFile;
//                         setForm({ ...form, images: updated });
//                       }
//                     }}
//                   />

//                   {/* Image Preview */}
//                   {file && (
//                     <div className="relative w-24 h-24 rounded overflow-hidden">
//                       <Image
//                         src={objectUrl}
//                         alt={`Image ${i}`}
//                         fill
//                         className="object-cover rounded"
//                         unoptimized
//                       />
//                     </div>
//                   )}

//                   {/* Delete Button */}
//                   {form.images.length > 0 && (
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => {
//                         const updated = [...form.images];
//                         updated.splice(i, 1);
//                         setForm({ ...form, images: updated });
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}

//             {/* Add More Images */}
//             {form.images.length < 4 && (
//               <Button
//                 variant="outline"
//                 type="button"
//                 className="mt-2"
//                 onClick={() =>
//                   setForm({
//                     ...form,
//                     images: [...form.images, null as unknown as File],
//                   })
//                 }
//               >
//                 {form.images.length === 0
//                   ? "+ Add Images"
//                   : "+ Add More Images"}
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Specifications Section */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold mb-2">Specifications</h3>
//         {form.specs.map((spec, index) => (
//           <div key={index} className="flex gap-2 mb-2">
//             <Input
//               placeholder="Key (e.g., Processor)"
//               value={spec.key}
//               onChange={(e) => handleSpecChange(index, "key", e.target.value)}
//             />
//             <Input
//               placeholder="Value (e.g., i7)"
//               value={spec.value}
//               onChange={(e) => handleSpecChange(index, "value", e.target.value)}
//             />
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleRemoveSpec(index)}
//             >
//               <Trash className="h-4 w-4" />
//             </Button>
//           </div>
//         ))}
//         <Button variant="outline" onClick={handleAddSpec} className="mt-2">
//           <Plus className="h-4 w-4 mr-2" /> Add Spec
//         </Button>
//       </div>

//       {/* Variants Section */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold mb-2">Variants</h3>
//         {form.variants.map((variant, vIdx) => (
//           <div key={vIdx} className="border p-4 mb-4 rounded space-y-2">
//             <Input
//               placeholder="Variant Name (e.g., Color)"
//               value={variant.name}
//               onChange={(e) => handleVariantNameChange(vIdx, e.target.value)}
//             />
//             {variant.values.map((val, valIdx) => (
//               <div key={valIdx} className="flex items-center gap-2 mt-2">
//                 <Input
//                   placeholder={`Value ${valIdx + 1}`}
//                   value={val}
//                   onChange={(e) =>
//                     handleVariantValueChange(vIdx, valIdx, e.target.value)
//                   }
//                 />
//                 {variant.values.length > 1 && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleRemoveVariantValue(vIdx, valIdx)}
//                   >
//                     <Trash className="w-4 h-4 text-red-500" />
//                   </Button>
//                 )}
//               </div>
//             ))}

//             <div className="flex gap-2 mt-2">
//               <Button
//                 variant="outline"
//                 onClick={() => handleAddVariantValue(vIdx)}
//               >
//                 + Add Value
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={() => handleRemoveVariant(vIdx)}
//               >
//                 Remove Variant
//               </Button>
//             </div>
//           </div>
//         ))}
//         <Button variant="outline" onClick={handleAddVariant}>
//           <Plus className="h-4 w-4 mr-2" /> Add Variant Group
//         </Button>
//       </div>

//       {/* Submit Button */}
//       <div className="mt-10">
//         <Button className="w-full md:w-auto cursor-pointer" onClick={handleSubmit}>
//           {
//             isSubmited ? "Submitting..." : "Submit Product"
//           }
//         </Button>
//       </div>
//     </div>
//   );
// }

import ProductForm, { Category } from "@/components/admin-dashboard/ProductForm"; 
export default async function AddProductPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories: Category[] = await res.json();

  return (
    <ProductForm
      mode="add"
      categories={categories}
    />
  );
}

