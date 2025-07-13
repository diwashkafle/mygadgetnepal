"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    addToCart,
    clearCart,
  } = useCartStore();

  const supabase = createClient();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();
  }, []);

  const increment = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item) addToCart({ ...item, quantity: 1 });
  };

  const decrement = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    if (item && item.quantity > 1) {
      const updated = items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
      useCartStore.setState({ items: updated });
    } else {
      removeFromCart(productId);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!session) {
      setShowDialog(true);
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link href="/">
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border p-4 rounded"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => decrement(item.productId)}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button variant="outline" size="icon" onClick={() => increment(item.productId)}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center border-t pt-6">
        <div>
          <p className="text-lg">
            <strong>Total:</strong> ₹{totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={clearCart}>
            Clear Cart
          </Button>
          <Button onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Dialog for Unauthenticated Users */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proceed to Checkout</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mb-4">
            You are not logged in. Would you like to continue as guest or log in first?
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => router.push("/checkout")}>
              Continue as Guest
            </Button>
            <Button onClick={() => supabase.auth.signInWithOAuth({ 
              provider: "google" ,
              options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
              },})}>
              Login to Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
