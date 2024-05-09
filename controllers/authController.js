import userModel from "../models/userModel.js";
//import orderModel from "../models/orderModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";


export const checkingController = async(req, res) => {
  try{
      const enteredemail=req.body.email;
      const userType = await userModel.findOne({email:enteredemail})
      // console.log(userType);
      if(userType)
      {
          const token = await JWT.sign({email: enteredemail, newUser: "False"}, process.env.JWT_SECRET, {expiresIn: "1d"});
          return res.status(200).send({success: true, type: "Olduser", username: userType.name, token})
      }
      else{
          const token1 = await JWT.sign({email: enteredemail, newUser: "True"}, process.env.JWT_SECRET, {expiresIn: "1d"});
           return res.status(200).send({success: true, type: "Newuser", email:enteredemail, token1})
      }
  }
  catch(error)
  {
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to check the entered email',
          error
      })
  }
}

export const sendOtp = async(req, res) => {
  try{
//generate otp and ref number
var otp="";
var ref="#ref";
for (let index = 0; index < 6; index++) {
  otp= otp+Math.floor(Math.random() * 10);
  ref=ref+Math.floor(Math.random() * 10);   
}

const otptoken = await JWT.sign({generatedOtp: otp, generatedRef: ref, email: req.body.email}, process.env.JWT_SECRET, {expiresIn: "5m"});

var em = req.body.email;
//send email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.SENDER_GMAIL_PASSCODE,
  }
});

var mailOptions = {
  from: process.env.SENDER_GMAIL,
  to: req.body.email,
  subject: 'OTP to validate from Medicure',
  text: `Hi,
    Welcome to Medicure, your one-stop point to buy all medicines. We hope you a very good health. Use OTP ${otp} with reference number ${ref} to validate your email. 
    This OneTime Password(OTP) is valid for the next 5 minutes.
Thank You,
Team Medicure`,
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    return res.status(201).send({message: "OTP has been sent via email", success: true, otptoken, reference: ref, email: em});
  }
});
//Email code


  }catch(error)
  {
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to send OTP',
          error
      })
  }

}

export const changePassword = async(req, res) => {
  try{
      const otptoken2 = req.body.headers['Authorization'].split(" ")[1];
      JWT.verify(otptoken2, process.env.JWT_SECRET, async (err, decode)=>{
          if(err)
          {
              return res.status(200).send({
                  message: `Authorization Failed`,
                  success: false
              })
          }
          else{
            //console.log(req.body);
            //console.log(decode);
              if(decode.generatedOtp==req.body.otp)
              {
                  const salt = await bcrypt.genSalt(10)
                  const hashedPassword = await bcrypt.hash(req.body.password, salt);
                  req.body.password = hashedPassword;
                  const pass = await userModel.findOneAndUpdate({email: decode.email}, {password: req.body.password});
                  // if(pass)
                  // {
                  //   console.log("Hi");
                  // }
                  const user = await userModel.findOne({email: decode.email, status: "Active"});
                  //console.log(user);
                  if(user)
                  {
                     // console.log("Hello All2");
                      const logintoken = JWT.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });
                      //Send email
                  //console.log("Hello All3");
                  var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: process.env.SENDER_GMAIL,
                        pass: process.env.SENDER_GMAIL_PASSCODE,
                      }
                    });
                  
                    var mailOptions = {
                      from: process.env.SENDER_GMAIL,
                      to: decode.email,
                      subject: 'Password got updated for your Medicure account',
                      text: `Hi ${user.name},
                        Welcome to Medicure, your one-stop point to buy all medicines. We hope you a very good health. This email is to inform you that the password for your Medicure account has been updated successfully. 
                        If it was not done by you please change your password immediately and contact our support.
          Thank You,
          Team Medicure`,
                      // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
                    };
                  
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                          console.log("Kanto");
                          console.log(logintoken);
                          return res.status(201).send({message: "Password updated successfully.", success: true, logintoken});
                          // console.log("Kanto1");
                          // console.log(res.data);
                      }
                    });
                    //Email code
                  }
                  else{

                      const u = await userModel.findOne({email: decode.email});
                      console.log(u);
                      //Send email
                  //console.log("Hello All3");
                  var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: process.env.SENDER_GMAIL,
                        pass: process.env.SENDER_GMAIL_PASSCODE,
                      }
                    });
                  
                    var mailOptions = {
                      from: process.env.SENDER_GMAIL,
                      to: decode.email,
                      subject: 'Password got updated for your Medicure account',
                      text: `Hi ${u.name},
                        Welcome to Medicure, your one-stop point to buy all medicines. We hope you a very good health. This email is to inform you that the password for your Medicure account has been updated successfully. 
                        If it was not done by you please change your password immediately and contact our support.
                  Thank You,
                  Team Medicure`,
                      // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
                    };
                  
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                          return res.status(200).send({message: "Your password has been updated but login failed as your account is blocked, contact admin.", success: true});
                          // console.log("Kanto1");
                          // console.log(res.data);
                      }
                    });
                    //Email code
                  }
              }
              else{
                  return res.status(200).send({success: false, message: "Wrong OTP entered, please try again."})
              }
          }})

  }catch(error)
  {
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to change Password',
          error
      })
  }
}

export const validateEmail = async(req, res) => {
  try{
      const otptoken1 = req.body.headers['Authorization'].split(" ")[1]
      JWT.verify(otptoken1, process.env.JWT_SECRET, async (err, decode)=>{
          if(err)
          {
              return res.status(200).send({
                  message: `Authorization Failed or OTP expired, please try again`,
                  success: false
              })
          }
          else{
              console.log(decode);
              console.log(req.body);
              if(decode.generatedOtp==req.body.otp)
              {
                  const verifiedtoken = await JWT.sign({verifiedemail: decode.email}, process.env.JWT_SECRET, {expiresIn: "15m"});
                  return res.status(200).send({success: true, message: "Email validated successfully.", verifiedtoken, Email: decode.email});
              }
              else{
                  return res.status(200).send({success: false, message: "Wrong OTP entered, please try again."});
              }
          }})

  }catch(error)
  {
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to validate Email',
          error
      })
  }
}

export const registerController = async(req, res) => {
  try{
      // const token = req.body.headers['Authorization'].split(" ")[1]
      // const decode = JWT.verify(token, process.env.JWT_SECRET);
      // console.log(req.body)
      // console.log("Hi")
      // console.log(decode)
      // console.log("Hi")
      // req.body = decode;
      // console.log(req.body)
      const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.formData.password, salt);
    req.body.formData.password = hashedPassword;
    const verifiedemail = req.body.headers['Authorization'].split(" ")[1];
      JWT.verify(verifiedemail, process.env.JWT_SECRET, async (err, decode)=>{
          if(err)
          {
              return res.status(200).send({
                  message: `Authorization Failed`,
                  success: false
              })
          }
          else{
              req.body.formData.email=decode.verifiedemail;
              const newUser = new userModel(req.body.formData);
              await newUser.save();

              const user=await userModel.findOne({email: decode.verifiedemail});

              const logintoken = JWT.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });
              
              //Send Email for successful registration
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.SENDER_GMAIL,
                    pass: process.env.SENDER_GMAIL_PASSCODE,
                  }
                });
              
                var mailOptions = {
                  from: process.env.SENDER_GMAIL,
                  to: req.body.formData.email,
                  subject: 'Welcome to Medicure',
                  text: `Hi ${req.body.formData.name},
                    Welcome to Medicure, your one-stop point to buy all medicines. We hope you a very good health and a wonderful journey with us. 
  Thank You,
  Team Medicure`,
                  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
                };
              
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    return res.status(201).send({message: "Registered successfully.", success: true, logintoken});
                  }
                });
                //Email code

          }})
  }catch(error)
  {
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to register',
          error
      })
  }
}

export const validatePassword = async(req, res)=> {
  try{
      // console.log("Hi All 4");
      const user = await userModel.findOne({email: req.body.email, status: "Active"});
      if(user){
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        const logintoken = JWT.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).send({ success: true, message: "Logged In successfully", logintoken });
  }else{
      return res.status(200).send({ success: false, message: "Wrong password entered, please try again"});
  }}else{
      return res.status(200).send({success: false, message: "Your account is blocked, contact our support."});
  }}catch(error){
      console.log(error);
      res.status(501).send({
          success: false,
          message: 'Failed to validate password',
          error
      });
  }
}

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const getUser = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {   
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// //orders
// export const getOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({ buyer: req.user._id })
//       .populate("products", "-photo")
//       .populate("buyer", "name");
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error WHile Geting Orders",
//       error,
//     });
//   }
// };
// //orders
// export const getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({})
//       .populate("products", "-photo")
//       .populate("buyer", "name")
//       .sort({ createdAt: "-1" });
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error WHile Geting Orders",
//       error,
//     });
//   }
// };

// //order status
// export const orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const orders = await orderModel.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error While Updateing Order",
//       error,
//     });
//   }
// };
