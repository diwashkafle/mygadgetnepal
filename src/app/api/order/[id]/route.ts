import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus, PaymentType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, paymentStatus, paymentType } = await req.json();

    if (!status && !paymentStatus && !paymentType) {
      return NextResponse.json(
        { error: "At least one of status, paymentStatus, or paymentType must be provided" },
        { status: 400 }
      );
    }

    const dataToUpdate: Prisma.OrderUpdateInput = {};

    if (status) {
      dataToUpdate.status = status as OrderStatus;
    }

    if (paymentStatus) {
      dataToUpdate.paymentStatus = paymentStatus;
    }

    if (paymentType) {
      dataToUpdate.paymentType = paymentType as PaymentType;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/order/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/order/[id] failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}