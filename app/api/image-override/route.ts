import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { saveImageOverride } from "@/lib/catalog-store";
import { imageOverrideSchema } from "@/lib/schema";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const VALID_CARD_ID = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

function extFromMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function saveFileLocally(cardId: string, file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = extFromMime(file.type);
  const filename = cardId + "." + ext;
  const dir = path.join(process.cwd(), "public", "cards", "custom");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return "/cards/custom/" + filename;
}

async function saveFileToSupabase(cardId: string, file: File): Promise<string | null> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = extFromMime(file.type);
  const storagePath = "custom/" + cardId + "." + ext;

  const { error } = await supabase.storage.from("cards").upload(storagePath, buffer, {
    contentType: file.type,
    upsert: true
  });

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from("cards").getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cardId = (formData.get("cardId") ?? "") as string;
    const imageAlt = (formData.get("imageAlt") ?? "") as string;
    const file = formData.get("file") as File | null;
    const imageUrl = (formData.get("imageUrl") ?? "") as string;

    if (!cardId.trim() || !VALID_CARD_ID.test(cardId.trim())) {
      return NextResponse.json(
        { error: "cardId must be a lowercase alphanumeric slug (e.g. alphabet-a)." },
        { status: 400 }
      );
    }

    let imageSrc: string;

    if (file && file.size > 0) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "File must be a JPEG, PNG, or WebP image." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "File must be 5 MB or smaller." }, { status: 400 });
      }

      // Try Supabase Storage first; fall back to local filesystem
      const supabaseUrl = await saveFileToSupabase(cardId, file);
      imageSrc = supabaseUrl ?? (await saveFileLocally(cardId, file));
    } else if (imageUrl.trim()) {
      imageSrc = imageUrl.trim();
    } else {
      return NextResponse.json(
        { error: "Provide either a file upload or an image URL." },
        { status: 400 }
      );
    }

    const override = imageOverrideSchema.parse({ cardId, imageSrc, imageAlt });
    await saveImageOverride(override);

    return NextResponse.json({ ok: true, imageSrc });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save image override." },
      { status: 500 }
    );
  }
}
