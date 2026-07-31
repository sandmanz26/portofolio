import { createContext, useContext, useEffect, useState } from "react";

/**
 * Client-side shopping cart. There's no checkout/payment on this
 * site — the "cart" exists so a visitor can gather several pieces
 * before requesting a price/invoice over WhatsApp (see Cart.jsx).
 * That means the cart doesn't need a backend of its own: it's kept
 * per-browser in localStorage, holding only { productId, quantity }
 * pairs. Product details (name, price, image) are always resolved
 * live from the product data layer when the cart is displayed, so
 * the cart never shows stale prices even if an admin edits a product
 * after it was added.
 */
// A safe no-op fallback (not null) so any component that happens to render
// outside a CartProvider — e.g. ProductCard reused in the admin panel's
// "live preview", which never mounts inside the public Layout that
// provides the real cart — doesn't crash. It just behaves like an
// always-empty cart there.
const noopCart = {
  items: [],
  count: 0,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
};

const CartContext = createContext(noopCart);

const STORAGE_KEY = "bhf_cart_v1";

function readStoredItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredItems());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private browsing, quota, etc.) — the cart
      // still works for this session, it just won't survive a reload.
    }
  }, [items]);

  function addToCart(productId, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
