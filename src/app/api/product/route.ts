import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      categoryId,
      price,
      crossedPrice,
      stock,
      status,
      description,
      images,
      specifications,
      variants,
      force,
    } = body

    // Basic validation
    if (
      !name ||
      !categoryId ||
      !price ||
      !crossedPrice ||
      !stock ||
      !status ||
      !description ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if(!force){
      const existingProduct = await prisma.product.findFirst({
        where:{
          name,
          categoryId,
        }
      });

      if(existingProduct){
        return NextResponse.json({
          message:"A product with the same name and category already exists.",
          duplicate:true,
        },
        {status:409}
      )
      }
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        price: parseFloat(price),
        crossedPrice: parseFloat(crossedPrice),
        stock: parseInt(stock),
        status,
        images,
        specifications,
        variants,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/product error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/product failed:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
