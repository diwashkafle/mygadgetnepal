"use client";

import { useEffect, useState,use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import PaymentMethodSelector from "@/components/client-components/PaymentOption";
 

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
};

export default function PaymentPage(props: { params: Promise<{ id: string }> }) {

  const {id} = use(props.params);

  const [order, setOrder] = useState<{
    id: string;
    customer: CustomerInfo;
    items: OrderItem[];
    total: number;
    paymentType: string | null;
  } | null>(null);


  const [selectedPayment, setSelectedPayment] = useState("COD");
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`);
        const data = await res.json();
        setOrder(data);
        setSelectedPayment(data.paymentType || "COD");
      } catch (err) {
        toast.error("Failed to load order.");
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  const handleConfirmPayment = async () => {
    try {
      toast.loading("Saving payment method...");

      const res = await fetch(`/api/order/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentType: selectedPayment }),
      });

      toast.dismiss();
      if (!res.ok) {
        toast.error("Failed to save payment method.");
        return;
      }

      toast.success("Payment method saved!");
      router.push(`/thank-you/${id}`); // Or confirmation page
    } catch (err) {
      toast.dismiss();
      toast.error("Error updating payment.");
      console.error(err);
    }
  };

  if (!order) return <div className="p-6 text-center">Loading order...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Payment</h2>

      {/* Customer Info */}
      <div className="mb-6 border rounded-md p-4 bg-gray-50 space-y-1">
        <h3 className="text-lg font-semibold">Delivery Details</h3>
        <p><strong>Name:</strong> {order.customer.name}</p>
        <p><strong>Email:</strong> {order.customer.email}</p>
        <p><strong>Phone:</strong> {order.customer.phone}</p>
        <p><strong>Address:</strong> {order.customer.address}, {order.customer.city} {order.customer.postalCode}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-6 border rounded-md p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Image src={item.image} alt={item.name} width={50} height={50} className="object-cover rounded" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.quantity} × ₹{item.price}</p>
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-lg font-bold">
          <p>Total</p>
          <p>₹{order.total}</p>
        </div>
      </div>

      {/* Payment Method */}
     <PaymentMethodSelector selected={selectedPayment} onChange={setSelectedPayment} />

      <Button onClick={handleConfirmPayment} className="w-full cursor-pointer">
        Confirm Payment Method
      </Button>
    </div>
  );
}
