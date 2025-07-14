"use client";

import { useCartStore } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [emailLocked, setEmailLocked] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setForm((prev) => ({ ...prev, email: session.user.email ?? "" }));
        setEmailLocked(true);
      }
    };

    fetchUser();
  }, []);

  const isValidNepaliPhone = (phone: string): boolean => {
    const phoneRegex = /^(98|97)\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleOrder = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidNepaliPhone(form.phone)) {
      toast.error("Enter a valid Nepali phone number!");
      return;
    }

    try {
      toast.loading("Placing order...");

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items,
          total,
          status: "Created", // or "Pending" if COD only
        }),
      });

      toast.dismiss();

      if (!res.ok) {
        toast.error("Failed to place order");
        return;
      }

      const data = await res.json();

      toast.success("Order placed successfully!");
      clearCart();

      // Redirect to payment with order ID
      router.push(`/payment/${data.orderId}`);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Something went wrong!");
    }
  };

  if (items.length === 0)
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
        <Button onClick={() => router.push("/")}>Go to Shop</Button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-8">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            readOnly={emailLocked}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Textarea
            placeholder="Shipping Address"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="flex gap-4">
            <Input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={(e) =>
                setForm({ ...form, postalCode: e.target.value })
              }
            />
          </div>
        </div>

        {/* Cart Summary */}
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>₹{total.toFixed(2)}</p>
          </div>

          <Button onClick={handleOrder} className="w-full mt-4">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
