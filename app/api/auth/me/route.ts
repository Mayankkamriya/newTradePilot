import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getUserDetails } from "@/lib/controllers/auth.controller";

export async function GET(req: Request) {
  try {
    const user = isAuthenticated(req);
    const data = await getUserDetails(user.id);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 401 }
    );
  }
}
