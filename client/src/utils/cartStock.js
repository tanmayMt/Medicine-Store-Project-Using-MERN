/** Available stock from a product document (DB field is `quantity`; API may expose `stock_quantity`). */
export function getStock(product) {
  if (!product) return 0;
  const raw = product.stock_quantity ?? product.quantity;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function getCartLineQty(line) {
  const q = Number(line?.cartQty);
  if (Number.isFinite(q) && q > 0) return Math.floor(q);
  return 1;
}

/**
 * One row per product; merges duplicate legacy rows; caps qty to stock.
 */
export function normalizeCartLines(cart) {
  const list = Array.isArray(cart) ? cart : [];
  const map = new Map();
  for (const line of list) {
    if (!line?._id) continue;
    const id = String(line._id);
    const stock = getStock(line);
    const prev = map.get(id);
    const add = getCartLineQty(line);
    const sum = (prev ? getCartLineQty(prev) : 0) + add;
    const { cartQty: _drop, ...rest } = line;
    const capped = stock === 0 ? 0 : Math.min(sum, stock);
    map.set(id, { ...rest, cartQty: capped });
  }
  return Array.from(map.values()).filter((l) => l.cartQty > 0);
}

export function cartLineSubtotal(line) {
  const qty = getCartLineQty(line);
  const price = Number(line?.price) || 0;
  return qty * price;
}

export function cartTotalUnits(cart) {
  return normalizeCartLines(cart).reduce((s, l) => s + getCartLineQty(l), 0);
}

export function cartSubtotalAmount(cart) {
  return normalizeCartLines(cart).reduce((s, l) => s + cartLineSubtotal(l), 0);
}

/**
 * Add or merge a product into the cart without exceeding stock.
 * @returns {{ cart: array, ok: boolean, message?: string }}
 */
export function addToCartWithStock(currentCart, product, addQty) {
  const stock = getStock(product);
  if (stock <= 0) {
    return { cart: normalizeCartLines(currentCart), ok: false, message: "This item is out of stock" };
  }
  const want = Math.max(1, Math.floor(Number(addQty)) || 1);
  const cart = normalizeCartLines(currentCart);
  const idx = cart.findIndex((l) => String(l._id) === String(product._id));
  const existing = idx >= 0 ? getCartLineQty(cart[idx]) : 0;
  const nextTotal = existing + want;
  if (nextTotal > stock) {
    return {
      cart,
      ok: false,
      message:
        existing > 0
          ? `You already have ${existing} in cart. Only ${stock} available.`
          : `Only ${stock} available in stock`,
    };
  }
  const nextLine = { ...(idx >= 0 ? cart[idx] : product), ...product, cartQty: nextTotal };
  const nextCart =
    idx >= 0 ? cart.map((l, i) => (i === idx ? nextLine : l)) : [...cart, { ...product, cartQty: want }];
  return { cart: normalizeCartLines(nextCart), ok: true };
}

export function incrementLineQty(cart, productId, delta) {
  const cartN = normalizeCartLines(cart);
  const idx = cartN.findIndex((l) => String(l._id) === String(productId));
  if (idx < 0) return cartN;
  const line = cartN[idx];
  const stock = getStock(line);
  const cur = getCartLineQty(line);
  const next = cur + delta;
  if (next < 1) return cartN.filter((_, i) => i !== idx);
  if (next > stock) return cartN;
  return cartN.map((l, i) => (i === idx ? { ...l, cartQty: next } : l));
}
