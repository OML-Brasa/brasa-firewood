"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  slug?: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  qty: number;
};

const CART_KEY = "brasa:cart";
const ORDER_KEY = "brasa:lastOrder";
const PROMO_KEY = "brasa:promo";

/** Demo promo codes → fractional discount off the subtotal. */
export const PROMO_CODES: Record<string, number> = { BRASA10: 0.1, FIRE15: 0.15 };

export function getPromo(): { code: string; rate: number } | null {
  try {
    const code = localStorage.getItem(PROMO_KEY);
    if (code && PROMO_CODES[code] != null) return { code, rate: PROMO_CODES[code] };
    return null;
  } catch {
    return null;
  }
}

export function setPromo(code: string | null) {
  try {
    if (code) localStorage.setItem(PROMO_KEY, code);
    else localStorage.removeItem(PROMO_KEY);
  } catch {
    /* ignore */
  }
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Parse a "From $2,450" / "$89" price string to a number. */
export const priceToNumber = (p: string) => parseFloat(p.replace(/[^0-9.]/g, "")) || 0;

// ---- external store (localStorage + in-tab pub/sub, hydration-safe) ----
const EMPTY: CartItem[] = [];
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(CART_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): CartItem[] {
  const raw = readRaw();
  if (raw === cache.raw) return cache.items;
  let items: CartItem[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed.filter((i) => i && i.id);
  } catch {
    items = [];
  }
  cache = { raw, items };
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  try {
    localStorage.setItem(CART_KEY, raw);
  } catch {
    /* storage unavailable — keep in-memory cache so the tab still works */
  }
  cache = { raw, items };
  listeners.forEach((l) => l());
}

// ---- mutations ----
export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }) {
  const items = getSnapshot().slice();
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + (item.qty ?? 1) };
  else items.push({ ...item, qty: item.qty ?? 1 });
  write(items);
}

export function updateQty(id: string, qty: number) {
  write(getSnapshot().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
}

export function removeFromCart(id: string) {
  write(getSnapshot().filter((i) => i.id !== id));
}

export function clearCart() {
  write([]);
}

// ---- hook ----
export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, subtotal, count };
}

// ---- order (for the confirmation page) ----
export type PlacedOrder = {
  orderNo: string;
  date: string;
  email: string;
  name: string;
  address: { line1: string; line2?: string; city: string; state: string; zip: string; country: string; phone?: string };
  shippingMethod: { name: string; price: number };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
};

export function generateOrderNo() {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `BRS-${year}-${n}`;
}

export function placeOrder(order: PlacedOrder) {
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
  setPromo(null);
  clearCart();
}

export function getLastOrder(): PlacedOrder | null {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
