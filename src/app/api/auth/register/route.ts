import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const adminCount = await prisma.adminUser.count();
    if (adminCount > 0) {
      return NextResponse.json({ error: "Registration closed" }, { status: 403 });
    }

    const { email, password } = await req.json();
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { email, password: hashed },
    });

    return NextResponse.json({ message: "Admin created, registration closed" });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
