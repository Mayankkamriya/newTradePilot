import { NextResponse } from "next/server";
import { getProjectBidsLogic } from "@/lib/controllers/bid.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const bids = await getProjectBidsLogic(projectId);
    return NextResponse.json(bids);
  } catch (err: any) {
    const status =
      err.message === "Project not found."
        ? 404
        : err.message.includes("required")
        ? 400
        : 500;

    return NextResponse.json(
      { message: err.message },
      { status }
    );
  }
}
