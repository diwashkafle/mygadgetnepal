import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default async function ThankYouPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) return notFound();

  const customer = order.customer as {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  const items = order.items as {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];

  const total = order.total;
  const paymentType = order.paymentType;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">🎉 Thank You for Your Order!</h1>

      <p className="text-gray-700 mb-8">
        Your order has been placed successfully. A confirmation has been sent to <strong>{customer.email}</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Customer Info */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>Postal Code:</strong> {customer.postalCode}</p>
          <p><strong>Payment:</strong> {paymentType}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded overflow-hidden bg-white border">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} × ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
