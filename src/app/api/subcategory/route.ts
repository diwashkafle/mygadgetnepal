import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: all subcategories (or optionally filter by categoryId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  try {
    const subcategories = await prisma.subcategory.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(subcategories);
  } catch (err) {
    console.error('GET /api/subcategory failed:', err);
    return NextResponse.json([], { status: 500 }); // Still return valid JSON
  }
}

// POST: create subcategory
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Missing name or categoryId" }, { status: 400 });
    }

    const created = await prisma.subcategory.create({
      data: { name, categoryId },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("Subcategory POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}