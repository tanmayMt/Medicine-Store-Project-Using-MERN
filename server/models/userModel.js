import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    deliveryAddresses: [{
      name: { type: String, required: true },
      phone: { type: String, required: true },
      pincode: { type: String, required: true },
      locality: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      landmark: { type: String, default: "" },
      alternatePhone: { type: String, default: "" },
      addressType: { type: String, enum: ["Home", "Work"], default: "Home" },
      isDefault: { type: Boolean, default: false },
    }],
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,  //Admin-1 or user -0
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);