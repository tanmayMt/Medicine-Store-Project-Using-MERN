import productModel from "../models/productModel.js";

/** Total units requested per product _id (supports legacy rows without cartQty). */
export function aggregateCartDemand(cart) {
  const map = new Map();
  for (const line of cart || []) {
    if (!line?._id) continue;
    const per = Number(line.cartQty);
    const u = Number.isFinite(per) && per > 0 ? Math.floor(per) : 1;
    const id = String(line._id);
    map.set(id, (map.get(id) || 0) + u);
  }
  return map;
}

/** Expand to repeated ObjectIds for legacy order schema (one ref per unit). */
export function orderProductIdsFromCart(cart) {
  const ids = [];
  for (const [pid, want] of aggregateCartDemand(cart)) {
    for (let i = 0; i < want; i++) ids.push(pid);
  }
  return ids;
}

export async function validateCartAgainstInventory(cart) {
  const demand = aggregateCartDemand(cart);
  if (demand.size === 0) {
    return { ok: false, errors: ["Cart is empty"] };
  }
  const errors = [];
  for (const [pid, want] of demand) {
    const p = await productModel.findById(pid).select("name quantity");
    if (!p) {
      errors.push(`Product ${pid} was not found`);
      continue;
    }
    const stock = Number(p.quantity) || 0;
    if (stock < want) {
      errors.push(`${p.name}: requested ${want}, only ${stock} in stock`);
    }
  }
  return { ok: errors.length === 0, errors };
}

/** Atomic decrement per line; rolls back prior lines if any line fails. */
export async function decrementInventoryForCart(cart) {
  const demand = aggregateCartDemand(cart);
  const done = [];
  for (const [pid, want] of demand) {
    const updated = await productModel.findOneAndUpdate(
      { _id: pid, quantity: { $gte: want } },
      { $inc: { quantity: -want } }
    );
    if (!updated) {
      for (const { id, w } of [...done].reverse()) {
        await productModel.findByIdAndUpdate(id, { $inc: { quantity: w } });
      }
      const p = await productModel.findById(pid).select("name quantity");
      throw new Error(
        p
          ? `Insufficient stock for ${p.name} (only ${p.quantity} available, needed ${want})`
          : `Product ${pid} not found`
      );
    }
    done.push({ id: pid, w: want });
  }
  return done;
}

export async function restoreInventoryDecrements(done) {
  for (const { id, w } of [...done].reverse()) {
    await productModel.findByIdAndUpdate(id, { $inc: { quantity: w } });
  }
}

export function computeCartTotal(cart) {
  let total = 0;
  for (const line of cart || []) {
    if (!line?._id) continue;
    const qty = Number(line.cartQty) > 0 ? Math.floor(Number(line.cartQty)) : 1;
    total += qty * (Number(line.price) || 0);
  }
  return total;
}
