import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateProjectStatus } from "@/lib/controllers/project.controller";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    isAuthenticated(req);

    const { projectId } = await params; 

    const body = await req.json();
    const { status, bidId, fileBase64 } = body;

    const project = await updateProjectStatus(
      projectId,
      status,
      bidId,
      fileBase64
    );

    return NextResponse.json({
      message: "Project status updated successfully",
      project,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
