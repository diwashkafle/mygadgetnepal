import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
       createdAt:'desc',
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch banners",error }, { status: 500 });
  }
}

// POST: Create a new banner
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      image,
      ctaText,
      ctaLink,
      fileid,
      isActive = true,
    } = body;

    if (
      !title ||
      !image ||
      !ctaText ||
      !ctaLink 
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        title,
        image,
        ctaText,
        ctaLink,
        isActive,
        fileId:fileid
      },
    });

    return NextResponse.json(newBanner);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create banner",error },
      { status: 500 }
    );
  }
}
