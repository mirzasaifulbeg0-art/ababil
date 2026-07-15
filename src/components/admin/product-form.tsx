"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { MediaUpload } from "@/components/admin/media-upload";
import { saveProduct } from "@/lib/actions/admin";

type Category = { id: string; name: string };

type ProductDefaults = {
  name?: string;
  description?: string;
  benefits?: string | null;
  ingredients?: string | null;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  categoryId?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
};

export function ProductForm({
  id,
  categories,
  defaultValues,
}: {
  id: string | null;
  categories: Category[];
  defaultValues?: ProductDefaults;
}) {
  const action = saveProduct.bind(null, id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const d = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={d.name ?? ""} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={d.description ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea
          id="benefits"
          name="benefits"
          rows={3}
          defaultValue={d.benefits ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="ingredients">Ingredients</Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          rows={3}
          defaultValue={d.ingredients ?? ""}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={d.price ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Compare-at price (₹)</Label>
          <Input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={d.compareAtPrice ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={d.stock ?? 0}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select
          id="categoryId"
          name="categoryId"
          defaultValue={d.categoryId ?? ""}
        >
          <option value="">— No category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <MediaUpload
        name="imageUrl"
        label="Product image"
        kind="image"
        defaultValue={d.imageUrl ?? ""}
        helpText="Shown on the product card and detail page."
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-navy-800">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={d.isActive ?? true}
            className="h-4 w-4 rounded border-slate-300 text-brand-green-500 focus:ring-brand-green-400"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-navy-800">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={d.isFeatured ?? false}
            className="h-4 w-4 rounded border-slate-300 text-brand-green-500 focus:ring-brand-green-400"
          />
          Featured
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : "Create product"}
        </Button>
        <Button href="/admin/products" variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
