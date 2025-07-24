import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.id !== params.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, phone } = await req.json();

  try {
    await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json({ message: "Profile updated" });
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
