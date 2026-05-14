import productModel from "../models/productModel.js";

/** Restore stock from order.products (array of ObjectId, repeated per unit). */
export async function restoreInventoryFromProductIds(productIds) {
  if (!Array.isArray(productIds) || productIds.length === 0) return;
  const map = new Map();
  for (const id of productIds) {
    if (!id) continue;
    const s = String(id);
    map.set(s, (map.get(s) || 0) + 1);
  }
  for (const [pid, count] of map) {
    await productModel.findByIdAndUpdate(pid, { $inc: { quantity: count } });
  }
}
