import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('GET /api/category failed:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json()

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, description },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('POST /api/category failed:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
