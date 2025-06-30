// store/cart-store.ts
import { create } from 'zustand';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item) => {
    const existing = get().items.find((i) => i.productId === item.productId);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },
  removeFromCart: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) });
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
