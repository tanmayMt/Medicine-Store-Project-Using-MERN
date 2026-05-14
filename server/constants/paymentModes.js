/** Allowed values stored on Order.paymentMode (must match client payloads exactly). */
export const PAYMENT_MODES = Object.freeze(["Online", "COD", "qrcode"]);

export function isValidPaymentMode(mode) {
  return typeof mode === "string" && PAYMENT_MODES.includes(mode);
}

export function assertOnlinePaymentMode(mode) {
  return mode === "Online";
}

export function isOfflineCheckoutPaymentMode(mode) {
  return mode === "COD" || mode === "qrcode";
}
