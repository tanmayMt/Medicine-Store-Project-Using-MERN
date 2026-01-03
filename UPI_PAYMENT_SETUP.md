# UPI Payment Setup Instructions

## Overview
UPI payment functionality has been added to your Medicine Store project. Customers can now pay via UPI by scanning a QR code.

## Setup Steps

### 1. Add Your UPI QR Code Image

1. Place your UPI QR code image in the following location:
   ```
   client/public/images/upi-qr-code.png
   ```

2. Supported formats: PNG, JPG, JPEG
3. Recommended size: 256x256 pixels or larger (square format works best)

### 2. Update UPI ID (Optional)

Currently, the UPI ID is hardcoded in `client/src/pages/CartPage.js`. To update it:

1. Open `client/src/pages/CartPage.js`
2. Find the line with: `your-upi-id@paytm`
3. Replace it with your actual UPI ID (e.g., `yourbusiness@paytm` or `yournumber@ybl`)

### 3. How It Works

1. Customer selects "UPI Payment (Scan QR Code)" option at checkout
2. QR code is displayed for scanning
3. Customer scans the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
4. Customer completes payment in their UPI app
5. Customer clicks "Confirm Order" button after payment
6. Order is placed with payment status "Pending"
7. Admin can manually verify payment and update order status

### 4. Order Status

- Orders placed via UPI will have `paymentMode: "UPI"` in the database
- Payment status will be marked as "Pending" until manually verified
- Admin should verify payments and update order status accordingly

## Future Enhancements (Optional)

You can enhance this by:
1. Adding an admin panel to upload/manage QR code
2. Adding payment verification API integration
3. Adding automatic payment status checking
4. Adding UPI ID configuration in admin settings

## Files Modified

1. `server/models/orderModel.js` - Added "UPI" to paymentMode enum
2. `server/controllers/productController.js` - Added `createUpiOrderController`
3. `server/routes/productRoutes.js` - Added UPI order route
4. `client/src/pages/CartPage.js` - Added UPI payment option with QR code display


