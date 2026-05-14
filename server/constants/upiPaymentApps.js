/** Allowed payment app names for UPI / QR proof (must match Order schema enum). */
export const UPI_PAYMENT_APPS = Object.freeze([
  "PhonePe",
  "Google Pay",
  "Paytm",
  "Bhim",
  "Other",
]);

export function isValidUpiPaymentApp(name) {
  return UPI_PAYMENT_APPS.includes(String(name || ""));
}
