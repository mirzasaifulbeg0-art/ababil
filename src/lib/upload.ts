import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

/**
 * Media upload helper.
 *
 * If Cloudinary credentials are present in the environment the file is streamed
 * to Cloudinary (recommended for production — survives serverless restarts).
 * Otherwise the file is written to `public/uploads/` and served from the same
 * origin. That keeps uploads working locally with zero configuration.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const FILE_TYPES = [...IMAGE_TYPES, "application/pdf"];

export type UploadKind = "image" | "file";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/** Allowed MIME types for a given upload kind. */
export function allowedTypes(kind: UploadKind): string[] {
  return kind === "image" ? IMAGE_TYPES : FILE_TYPES;
}

/** A safe, collision-resistant file name that keeps the original extension. */
function safeFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const stamp = randomBytes(8).toString("hex");
  return `${stamp}${ext || ""}`;
}

export type UploadResult = { url: string };

/**
 * Persist an uploaded file and return its public URL.
 *
 * @param file  The `File` pulled from a multipart form.
 * @param kind  "image" restricts to image MIME types, "file" also allows PDF.
 */
export async function saveUploadedFile(
  file: File,
  kind: UploadKind = "image"
): Promise<UploadResult> {
  if (!file || typeof file === "string") {
    throw new Error("No file provided");
  }
  if (file.size === 0) {
    throw new Error("The uploaded file is empty");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (max 10 MB)");
  }
  const allowed = allowedTypes(kind);
  if (file.type && !allowed.includes(file.type)) {
    throw new Error(
      kind === "image"
        ? "Please upload an image file (JPG, PNG, WebP, GIF or AVIF)"
        : "Please upload an image or PDF file"
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // --- Cloudinary path -----------------------------------------------------
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ababil",
          resource_type: file.type === "application/pdf" ? "raw" : "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(result.secure_url);
        }
      );
      stream.end(bytes);
    });
    return { url };
  }

  // --- Local filesystem fallback ------------------------------------------
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const fileName = safeFileName(file.name);
  await writeFile(path.join(uploadsDir, fileName), bytes);
  return { url: `/uploads/${fileName}` };
}
