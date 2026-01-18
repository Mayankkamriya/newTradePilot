import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { allowRoles } from "@/lib/roles";
import { createBidLogic } from "@/lib/controllers/bid.controller";

export async function POST(req: Request) {
  try {
    const user = isAuthenticated(req);
   allowRoles(user, ["SELLER"]);


    const body = await req.json();
    const bid = await createBidLogic(user.id, body);

    return NextResponse.json(bid, { status: 201 });
  } catch (err: any) {
    const status =
      err.message === "Project not found."
        ? 404
        : err.message === "You cannot bid on your own project."
        ? 403
        : err.message === "All fields are required."
        ? 400
        : 500;

    return NextResponse.json(
      { message: err.message },
      { status }
    );
  }
}
