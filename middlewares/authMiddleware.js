import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    // console.log('Hi1');
    const token = req.body.headers['Authorization'].split(" ")[1]
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    //console.log(decode);
    req.body.id = decode.id;
    // console.log("Hi "+req.body.id);
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    // console.log("Hi");
    // console.log(req.body);
    const user = await userModel.findById(req.body.id);
    if (user.role !== 1) {    //0 means normal user
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};