import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/user.service";
import { z } from "zod";

const RegisterSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
  phone:    z.string().min(10, "Phone number must be at least 10 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);
    await createUser(data);
    return NextResponse.json({ success: true, message: "Registration successful" }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
