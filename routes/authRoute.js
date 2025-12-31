import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
  getDashboardStatsController,
  getDeliveryAddressesController,
  addDeliveryAddressController,
  updateDeliveryAddressController,
  deleteDeliveryAddressController,
  setDefaultAddressController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  orderStatusController
);
router.put(
  "/order-status-admin/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


//all users
router.get("/users", requireSignIn,isAdmin,getAllUsersController);

//dashboard stats
router.get("/dashboard-stats", requireSignIn, isAdmin, getDashboardStatsController);

// Delivery Address Management Routes
router.get("/delivery-addresses", requireSignIn, getDeliveryAddressesController);
router.post("/delivery-addresses", requireSignIn, addDeliveryAddressController);
router.put("/delivery-addresses/:addressId", requireSignIn, updateDeliveryAddressController);
router.delete("/delivery-addresses/:addressId", requireSignIn, deleteDeliveryAddressController);
router.put("/delivery-addresses/:addressId/set-default", requireSignIn, setDefaultAddressController);

export default router;