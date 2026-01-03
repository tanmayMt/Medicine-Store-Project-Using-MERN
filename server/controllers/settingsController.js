import settingsModel from "../models/settingsModel.js";

// Get settings
export const getSettingsController = async (req, res) => {
  try {
    const settings = await settingsModel.getSettings();
    res.status(200).send({
      success: true,
      settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting settings",
      error,
    });
  }
};

// Update settings
export const updateSettingsController = async (req, res) => {
  try {
    const { payment, general, shipping } = req.body;

    // Get existing settings or create new one
    let settings = await settingsModel.findOne();
    
    if (!settings) {
      settings = new settingsModel({ payment, general, shipping });
    } else {
      // Update only provided fields
      if (payment) {
        settings.payment = { ...settings.payment, ...payment };
      }
      if (general) {
        settings.general = { ...settings.general, ...general };
      }
      if (shipping) {
        settings.shipping = { ...settings.shipping, ...shipping };
      }
    }

    await settings.save();

    res.status(200).send({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating settings",
      error,
    });
  }
};

// Get UPI settings only (public endpoint for cart page)
export const getUpiSettingsController = async (req, res) => {
  try {
    const settings = await settingsModel.getSettings();
    res.status(200).send({
      success: true,
      upiId: settings.payment?.upiId || "your-upi-id@paytm",
      upiEnabled: settings.payment?.upiEnabled !== false, // default to true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting UPI settings",
      error,
    });
  }
};


