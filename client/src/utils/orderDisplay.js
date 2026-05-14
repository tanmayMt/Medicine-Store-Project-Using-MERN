/** Maps stored Order.paymentMode to user-facing label. */
export function getPaymentModeLabel(mode) {
  if (!mode) return "N/A";
  const m = String(mode).toLowerCase();
  if (m === "online") return "Online";
  if (m === "cod") return "COD";
  if (m === "qrcode" || m === "qr") return "QR Code Payment";
  if (m === "upi") return "UPI (legacy)";
  return String(mode);
}

/**
 * Resolves payment status label + badge class for list/detail UIs.
 * Prefers Order.paymentStatus; falls back for older documents.
 */
export function getPaymentStatusMeta(order) {
  const ps = order?.paymentStatus;
  if (ps === "Success" || ps === "Pending" || ps === "Failed") {
    return {
      label: ps,
      badgeClass:
        ps === "Success"
          ? "bg-green-100 text-green-800"
          : ps === "Pending"
            ? "bg-amber-100 text-amber-800"
            : "bg-red-100 text-red-800",
    };
  }

  const mode = String(order?.paymentMode || "").toLowerCase();
  if (mode === "cod" || mode === "qrcode") {
    return { label: "Pending", badgeClass: "bg-amber-100 text-amber-800" };
  }
  if (mode === "online" && order?.payment?.success) {
    return { label: "Success", badgeClass: "bg-green-100 text-green-800" };
  }
  if (mode === "online") {
    return { label: "Failed", badgeClass: "bg-red-100 text-red-800" };
  }
  if (order?.payment?.success) {
    return { label: "Success", badgeClass: "bg-green-100 text-green-800" };
  }
  return { label: "Pending", badgeClass: "bg-amber-100 text-amber-800" };
}
