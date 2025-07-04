import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all banners
export async function GET() {
  try {
    const now = new Date();
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: {
        priority: "desc",
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json({ message: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST: Create a new banner
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      startDate,
      endDate,
      isActive,
      priority,
    } = body;

    if (
      !title ||
      !image ||
      !ctaText ||
      !ctaLink ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        ctaText,
        ctaLink,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        priority: Number(priority),
      },
    });

    return NextResponse.json(newBanner);
  } catch (error) {
    console.error("Banner create error:", error);
    return NextResponse.json(
      { message: "Failed to create banner" },
      { status: 500 }
    );
  }
}
