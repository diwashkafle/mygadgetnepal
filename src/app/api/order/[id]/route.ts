import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus, PaymentType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { paymentType, status } = await req.json();

    if (!paymentType && !status) {
      return NextResponse.json(
        { error: "Either paymentType or status must be provided" },
        { status: 400 }
      );
    }

    const dataToUpdate: Prisma.OrderUpdateInput = {};

    if (paymentType) {
      const normalized = paymentType.toUpperCase();
      dataToUpdate.paymentType = normalized as PaymentType;

      // Optional: auto-set status based on payment type
      if (normalized === "COD") {
        dataToUpdate.status = "Pending";
      } else {
        dataToUpdate.status = "Paid";
      }
    }

    if (status) {
      dataToUpdate.status = status as OrderStatus;
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/order/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
