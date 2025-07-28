import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (err) {
    return NextResponse.json({ message: "Internal server error",err }, { status: 500 });
  }
}

// PUT /api/banner/:id – Update banner
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedBanner);
  } catch (err) {
    return NextResponse.json({ message: "Update failed",err }, { status: 500 });
  }
}

// DELETE /api/banner/:id – Delete banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Banner deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Deletion failed",err }, { status: 500 });
  }
}
