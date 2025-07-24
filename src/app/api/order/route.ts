import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) { 
  try {
    const body = await req.json();
    const { customer, items, total, paymentType } = body;

    if (!customer || !items || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || "";
    const userName = session?.user?.name || "Guest User";

    if (userId) {
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            name: userName,
          },
        });
      }
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        customer,
        items,
        total,
        paymentType,
        status: "Pending", // Safe enum value
        paymentStatus: "Unpaid",
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Order creation failed", detail: err },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map through and format response
    const formatted = orders.map((order) => {
      const customer = order.customer as {
        name: string;
        email: string;
        phone: string;
        address: string;
      };

      return {
        id: order.id,
        customer,
        total: order.total,
        status: order.status,
        paymentType: order.paymentType,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
