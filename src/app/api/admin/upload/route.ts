import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedFile, type UploadKind } from "@/lib/upload";

/** File uploads need the Node.js runtime (Buffer / fs / Cloudinary SDK). */
export const runtime = "nodejs";

/**
 * POST /api/admin/upload
 *
 * Admin-only. Accepts multipart form-data with:
 *   - `file` : the uploaded file (required)
 *   - `kind` : "image" (default) or "file" (allows PDF too)
 *
 * Returns `{ url }` pointing at the stored media.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const kind = (formData.get("kind") as UploadKind) || "image";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const { url } = await saveUploadedFile(file as File, kind);
    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
