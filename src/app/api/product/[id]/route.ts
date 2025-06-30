import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromFirebase } from "@/lib/firebase/deleteFormFirebase";

export async function DELETE(req: NextRequest,{params}:{params:{id:string}}) {
  const productId = params.id

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Extract Firebase paths from image URLs
    const pathsToDelete = product.images.map((url) => {
      const matches = url.match(/\/o\/(.*?)\?alt/);
      if (matches && matches[1]) {
        return decodeURIComponent(matches[1]); // gives 'products/filename.ext'
      }
      return null;
    }).filter(Boolean) as string[];

    // Delete all images
    await Promise.all(pathsToDelete.map(deleteFromFirebase));

    // Delete product from DB
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { category: true },
      })
  
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
  
      return NextResponse.json(product)
    } catch (error) {
      console.error('GET /product/[id] failed:', error)
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
  }
  
  export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json()
      const { name, price, crossedPrice, stock, description, categoryId, status, specifications, variants, images } = body
  
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
      })
  
      return NextResponse.json(updated)
    } catch (error) {
      console.error('PATCH /product/[id] failed:', error)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
  }
  