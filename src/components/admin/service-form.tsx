"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { saveService } from "@/lib/actions/admin";

type Category = { id: string; name: string };

type ServiceDefaults = {
  name?: string;
  shortDescription?: string;
  description?: string;
  requiredDocuments?: string;
  eligibility?: string;
  processingTime?: string;
  serviceCharge?: number;
  categoryId?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
};

export function ServiceForm({
  id,
  categories,
  defaultValues,
}: {
  id: string | null;
  categories: Category[];
  defaultValues?: ServiceDefaults;
}) {
  const action = saveService.bind(null, id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const d = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={d.name ?? ""} required />
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          defaultValue={d.shortDescription ?? ""}
          required
        />
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
        <Label htmlFor="requiredDocuments">Required documents</Label>
        <Textarea
          id="requiredDocuments"
          name="requiredDocuments"
          rows={3}
          defaultValue={d.requiredDocuments ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="eligibility">Eligibility</Label>
        <Textarea
          id="eligibility"
          name="eligibility"
          rows={3}
          defaultValue={d.eligibility ?? ""}
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="processingTime">Processing time</Label>
          <Input
            id="processingTime"
            name="processingTime"
            placeholder="3-5 working days"
            defaultValue={d.processingTime ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="serviceCharge">Service charge (₹)</Label>
          <Input
            id="serviceCharge"
            name="serviceCharge"
            type="number"
            step="0.01"
            min="0"
            defaultValue={d.serviceCharge ?? ""}
            required
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

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : "Create service"}
        </Button>
        <Button href="/admin/services" variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
