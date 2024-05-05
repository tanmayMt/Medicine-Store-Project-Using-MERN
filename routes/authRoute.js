import express from "express";
import {
  testController,
  checkingController, sendOtp, validateEmail, registerController, validatePassword, changePassword
  // getOrdersController,
  // getAllOrdersController,
  // orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { verifyuser, verifyolduser, resetolduser} from "../middlewares/usertypeMiddleware.js";
import { verifyuserandResend} from "../middlewares/resendMiddleware.js";

//router object
const router = express.Router();

//routing
router.post("/check",checkingController);
router.post("/sendOtp", verifyuser, sendOtp);
router.post("/resetOtp", resetolduser, sendOtp);
router.post("/validateEmail", validateEmail);
router.post("/resetpassword", changePassword);
router.post("/register", registerController);
router.post("/resendotp", verifyuserandResend, sendOtp);
router.post("/vpassword", verifyolduser, validatePassword);

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
//router.put("/profile", requireSignIn, updateProfileController);

// //orders
// router.get("/orders", requireSignIn, getOrdersController);

// //all orders
// router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// // order status update
// router.put(
//   "/order-status/:orderId",
//   requireSignIn,
//   isAdmin,
//   orderStatusController
// );

export default router;