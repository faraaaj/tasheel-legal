import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * Serves images from an external folder outside the Next.js project root:
 *   C:\ZZ-TASHEEL WEBSITE\XX-PHOTOS
 *
 * Reached via the rewrite: /team/:path* -> /api/serve-image/:path*
 * Hardened against path traversal (rejects "..", backslashes, and
 * absolute-path injection; result must stay inside the base folder).
 */

const IMAGE_ROOT = "C:\\ZZ-TASHEEL WEBSITE\\XX-PHOTOS";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;

    if (!segments?.length) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Reject traversal attempts before touching the filesystem.
    const unsafe = segments.some(
      (seg) =>
        !seg ||
        seg === "." ||
        seg === ".." ||
        seg.includes("\\") ||
        seg.includes("/") ||
        path.isAbsolute(seg)
    );
    if (unsafe) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const filePath = path.join(IMAGE_ROOT, ...segments);

    // Defence in depth: resolved path must remain inside IMAGE_ROOT.
    if (!path.resolve(filePath).startsWith(path.resolve(IMAGE_ROOT) + path.sep)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
