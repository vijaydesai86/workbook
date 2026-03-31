import { NextRequest, NextResponse } from "next/server";
import { getMergedCatalog } from "@/lib/catalog-store";
import { buildTrainingProposal } from "@/lib/copilot";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { prompt?: string };
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "A training prompt is required." }, { status: 400 });
    }

    const catalog = await getMergedCatalog();
    const result = await buildTrainingProposal({ prompt, catalog });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate a proposal."
      },
      { status: 500 }
    );
  }
}
