import { NextResponse } from "next/server";
import { loginUser } from "@/lib/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await loginUser(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.message === "Invalid credentials" ? 401 : 404 }
    );
  }
}
