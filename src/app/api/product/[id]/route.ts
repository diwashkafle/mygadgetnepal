import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If you store fileId later, this is where you delete from ImageKit
    // const fileIds = product.images.map(img => img.fileId).filter(Boolean);
    // await Promise.all(fileIds.map(id => imagekit.deleteFile(id)));

    // Delete product from DB
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(" DELETE /api/product/[id] failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/product/[id] failed:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const {
      name,
      price,
      crossedPrice,
      stock,
      description,
      categoryId,
      status,
      specifications,
      variants,
      images,
    } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price,
        crossedPrice,
        stock,
        description,
        categoryId,
        status,
        specifications,
        variants,
        images,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(" PATCH /api/product/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
