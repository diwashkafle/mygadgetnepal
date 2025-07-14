import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabaseServer";
import { prisma } from "@/lib/prisma";

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

    const supabase = await createApiClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized or invalid user session" },
        { status: 401 }
      );
    }

    // Auto-create user if not already in the database
    const userId = user.id;
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email: user.email ?? "",
          name:user.user_metadata?.name || "Guest User",
        },
      });
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
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

