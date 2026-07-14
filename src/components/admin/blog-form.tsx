"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { saveBlog } from "@/lib/actions/admin";

type Category = { id: string; name: string };

type BlogDefaults = {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  categoryId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published?: boolean;
};

export function BlogForm({
  id,
  categories,
  defaultValues,
}: {
  id: string | null;
  categories: Category[];
  defaultValues?: BlogDefaults;
}) {
  const action = saveBlog.bind(null, id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const d = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={d.title ?? ""} required />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={d.excerpt ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={d.content ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://..."
          defaultValue={d.coverImage ?? ""}
        />
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

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            defaultValue={d.metaTitle ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="metaDescription">Meta description</Label>
          <Input
            id="metaDescription"
            name="metaDescription"
            defaultValue={d.metaDescription ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-navy-800">
          <input
            type="checkbox"
            name="published"
            defaultChecked={d.published ?? false}
            className="h-4 w-4 rounded border-slate-300 text-brand-green-500 focus:ring-brand-green-400"
          />
          Published
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : "Create post"}
        </Button>
        <Button href="/admin/blogs" variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
