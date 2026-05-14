/** Maps stored Order.paymentMode to user-facing label. */
export function getPaymentModeLabel(mode) {
  if (!mode) return "N/A";
  const m = String(mode).toLowerCase();
  if (m === "online") return "Online";
  if (m === "cod") return "COD";
  if (m === "qrcode" || m === "qr") return "UPI / QR";
  if (m === "upi") return "UPI (legacy)";
  return String(mode);
}

/**
 * Resolves payment / verification status for list/detail UIs.
 */
export function getPaymentStatusMeta(order) {
  const pv = order?.paymentVerificationStatus;
  if (pv && pv !== "NA") {
    if (pv === "Verified") {
      return { label: "Verified", badgeClass: "bg-green-100 text-green-800" };
    }
    if (pv === "Pending") {
      return { label: "Pending verification", badgeClass: "bg-amber-100 text-amber-800" };
    }
    if (pv === "Rejected") {
      return { label: "Rejected", badgeClass: "bg-red-100 text-red-800" };
    }
    if (pv === "Timed_Out") {
      return { label: "Timed out", badgeClass: "bg-gray-100 text-gray-700" };
    }
  }

  const ps = order?.paymentStatus;
  if (ps === "Paid") {
    return { label: "Paid", badgeClass: "bg-green-100 text-green-800" };
  }
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
  if (mode === "cod" || mode === "qrcode" || mode === "qr") {
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
