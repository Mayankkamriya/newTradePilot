import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadDeliverableLogic } from "@/lib/controllers/deliverable.controller";

export async function POST(req: Request) {
  try {
    isAuthenticated(req);

    const body = await req.json();
    const { projectId, fileUrl } = body;

    const deliverable = await uploadDeliverableLogic(projectId, fileUrl);

    return NextResponse.json(
      {
        message: "Deliverable uploaded and project completed",
        deliverable,
      },
      { status: 201 }
    );
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
