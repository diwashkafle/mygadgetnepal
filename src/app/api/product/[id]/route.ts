import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

// Already has DELETE

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
  