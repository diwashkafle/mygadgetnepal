import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { adminUser: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: record.adminUserId },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ message: "Password has been reset" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
