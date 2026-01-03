import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    payment: {
      upiEnabled: {
        type: Boolean,
        default: true,
      },
      upiId: {
        type: String,
        default: "your-upi-id@paytm",
      },
      stripeEnabled: {
        type: Boolean,
        default: false,
      },
      paypalEnabled: {
        type: Boolean,
        default: false,
      },
      cashOnDelivery: {
        type: Boolean,
        default: true,
      },
    },
    general: {
      storeName: {
        type: String,
        default: "Medicure",
      },
      storeEmail: {
        type: String,
        default: "admin@medicure.com",
      },
      storePhone: {
        type: String,
        default: "+1 (234) 567-890",
      },
      storeAddress: {
        type: String,
        default: "123 Medical Street, Health City, HC 12345",
      },
      currency: {
        type: String,
        default: "INR",
      },
      timezone: {
        type: String,
        default: "America/New_York",
      },
    },
    shipping: {
      freeShippingThreshold: {
        type: Number,
        default: 50,
      },
      standardShipping: {
        type: Number,
        default: 5.99,
      },
      expressShipping: {
        type: Number,
        default: 12.99,
      },
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("Settings", settingsSchema);


