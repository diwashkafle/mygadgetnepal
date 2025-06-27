import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await req.json()

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: { name, description },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/category failed:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('DELETE /api/category failed:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
