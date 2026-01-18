import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { allowRoles } from "@/lib/roles";

export async function POST(req: Request) {
  try {
    // 🔐 Auth
    const user = await isAuthenticated(req);
    allowRoles(user, ["BUYER"]);

    const body = await req.json();
    const { title, description, budgetMin, budgetMax, deadline } = body;

    // Basic validation
    if (!title || !description || !budgetMin || !budgetMax || !deadline) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        deadline: new Date(deadline),
        status: "PENDING",
        buyerId: user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        bids: true,
      },
    });

    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
