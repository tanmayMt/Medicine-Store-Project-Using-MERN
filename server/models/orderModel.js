import mongoose from "mongoose";
import { PAYMENT_MODES } from "../constants/paymentModes.js";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    // Ideally, for a pro app, products should look like this (optional upgrade):
    /*
    products: [
      {
        product: { type: mongoose.ObjectId, ref: "Products" },
        count: { type: Number, default: 1 },
        price: { type: Number } // Save price at time of purchase
      }
    ],
    */
    payment: {}, // Stores the Braintree response or your COD object

    paymentMode: {
      type: String,
      enum: PAYMENT_MODES,
      default: "Online",
    },

    paymentStatus: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      default: "Pending",
    },

    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },

    // NEW: Save the address specifically for this order
    shippingAddress: {
      type: Object, // Or String, depending on how you store address
      required: true,
    },

    // NEW: Save the final total price
    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Order Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned"
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);