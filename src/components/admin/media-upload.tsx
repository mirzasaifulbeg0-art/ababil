"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, X, Link2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type MediaUploadProps = {
  /** Form field name — the resolved URL is submitted under this name. */
  name: string;
  label: string;
  /** Existing value when editing. */
  defaultValue?: string | null;
  /** "image" shows a thumbnail preview; "file" also accepts PDFs. */
  kind?: "image" | "file";
  /** Override the file picker's accept attribute. */
  accept?: string;
  required?: boolean;
  helpText?: string;
};

export function MediaUpload({
  name,
  label,
  defaultValue,
  kind = "image",
  accept,
  required = false,
  helpText,
}: MediaUploadProps) {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr =
    accept ?? (kind === "image" ? "image/*" : "image/*,application/pdf");

  async function uploadFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed. Please try again.");
      }
      setValue(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Allow re-selecting the same file.
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const isPdf = value.toLowerCase().endsWith(".pdf");
  const hasValue = value.trim().length > 0;

  return (
    <div>
      <Label htmlFor={`${name}-file`}>{label}</Label>

      {/* Submitted value — the server action reads this. */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Preview of the current media. */}
      {hasValue && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {kind === "image" && !isPdf ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-green-50 text-brand-green-600">
              <FileText className="h-7 w-7" />
            </span>
          )}
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-brand-navy-700 hover:underline"
          >
            {value}
          </a>
          <button
            type="button"
            onClick={() => setValue("")}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" /> Remove
          </button>
        </div>
      )}

      {/* Drop zone / picker. */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          dragging
            ? "border-brand-green-400 bg-brand-green-50"
            : "border-slate-200 bg-white hover:border-brand-green-300 hover:bg-slate-50"
        )}
      >
        {uploading ? (
          <span className="flex items-center gap-2 text-sm text-brand-navy-700">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </span>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-brand-green-500" />
            <span className="text-sm font-medium text-brand-navy-800">
              {hasValue ? "Replace file" : "Click to upload"}{" "}
              <span className="font-normal text-slate-500">or drag & drop</span>
            </span>
            <span className="text-xs text-slate-400">
              {kind === "image"
                ? "JPG, PNG, WebP, GIF up to 10 MB"
                : "Image or PDF up to 10 MB"}
            </span>
          </>
        )}
        <input
          id={`${name}-file`}
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          onChange={onSelect}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}

      {/* Escape hatch: paste an external URL instead of uploading. */}
      <button
        type="button"
        onClick={() => setShowUrlInput((s) => !s)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-navy-500 hover:text-brand-navy-700"
      >
        <Link2 className="h-3.5 w-3.5" />
        {showUrlInput ? "Hide URL field" : "Or paste a URL"}
      </button>
      {showUrlInput && (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-brand-navy-900 placeholder:text-slate-400 transition-colors focus:border-brand-green-400 focus:outline-none focus:ring-2 focus:ring-brand-green-100"
        />
      )}
    </div>
  );
}
