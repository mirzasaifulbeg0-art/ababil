"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { MediaUpload } from "@/components/admin/media-upload";
import { saveBook } from "@/lib/actions/admin";

type Category = { id: string; name: string };

const LANGUAGES = [
  "ARABIC",
  "ENGLISH",
  "BENGALI",
  "URDU",
  "HINDI",
  "OTHER",
] as const;

type BookDefaults = {
  title?: string;
  author?: string;
  language?: string;
  description?: string;
  coverImage?: string | null;
  pdfUrl?: string;
  categoryId?: string | null;
  isActive?: boolean;
};

export function BookForm({
  id,
  categories,
  defaultValues,
}: {
  id: string | null;
  categories: Category[];
  defaultValues?: BookDefaults;
}) {
  const action = saveBook.bind(null, id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const d = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={d.title ?? ""} required />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            defaultValue={d.author ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            name="language"
            defaultValue={d.language ?? "OTHER"}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
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

      <MediaUpload
        name="coverImage"
        label="Cover image"
        kind="image"
        defaultValue={d.coverImage ?? ""}
        helpText="Book cover shown in the library."
      />

      <MediaUpload
        name="pdfUrl"
        label="Book PDF"
        kind="file"
        accept="application/pdf"
        required
        defaultValue={d.pdfUrl ?? ""}
        helpText="The downloadable/readable PDF file. Required."
      />

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
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : "Create book"}
        </Button>
        <Button href="/admin/books" variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
