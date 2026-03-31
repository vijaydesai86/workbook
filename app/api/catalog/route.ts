import { NextResponse } from "next/server";
import { getMergedCatalog } from "@/lib/catalog-store";

export const runtime = "nodejs";

export async function GET() {
  const catalog = await getMergedCatalog();
  return NextResponse.json(catalog);
}
