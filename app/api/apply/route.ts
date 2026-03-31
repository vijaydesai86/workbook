import { NextRequest, NextResponse } from "next/server";
import { applyTrainingProposal } from "@/lib/catalog-store";
import { trainingProposalSchema } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const proposal = trainingProposalSchema.parse(body.proposal);
    await applyTrainingProposal(proposal);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to apply proposal."
      },
      { status: 400 }
    );
  }
}
