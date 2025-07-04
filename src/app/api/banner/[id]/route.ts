import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// GET /api/banner/:id – Fetch one banner
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!banner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (err) {
    console.error("GET BANNER ERROR:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/banner/:id – Update banner
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updatedBanner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        priority: data.priority,
      },
    });

    return NextResponse.json(updatedBanner);
  } catch (err) {
    console.error("UPDATE BANNER ERROR:", err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/banner/:id – Delete banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Banner deleted" });
  } catch (err) {
    console.error("DELETE BANNER ERROR:", err);
    return NextResponse.json({ message: "Deletion failed" }, { status: 500 });
  }
}
