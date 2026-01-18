import { NextResponse } from "next/server";
import { signupUser } from "@/lib/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await signupUser(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.message.includes("exists") ? 409 : 400 }
    );
  }
}
