// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         type: mongoose.ObjectId,
//         ref: "Products",
//       },
//     ],
//     payment: {},
//     buyer: {
//       type: mongoose.ObjectId,
//       ref: "users",
//     },
//     status: {
//       type: String,
//       default: "Order Placed",
//       enum: ["Order Placed", "Shipped", "Delivered", "Cancelled", "Returned"],
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

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
    
    // NEW: To distinguish between COD and Card easily
    paymentMode: {
      type: String,
      enum: ["Online", "COD"], 
      default: "Online",
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