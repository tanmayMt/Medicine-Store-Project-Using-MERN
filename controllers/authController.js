import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    //Welcome Email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.SENDER_GMAIL_PASSCODE,
  }
});

var mailOptions = {
  from: process.env.SENDER_GMAIL,
  to: email,
  subject: 'Welcome to Medicure',
  text: `Hi ${name},
    Welcome to Medicure, your one-stop point to buy all medicines. We hope you a very good health. Your account has been successfully created in Medicure. 
Thank You,
Team Medicure`,
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  }
});
    // Welcome email ends

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
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
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id }).sort({createdAt: -1})
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders --admin
export const getAllOrdersController = async (req, res) => {
  try {
    
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if(orders){
     // console.log("Hi78");
      const order = await orderModel.findById({_id:orderId});

      const rt = order.buyer.toString();
      // console.log(order.buyer);
      //console.log(rt);
      const user = await userModel.findById({_id:rt});
     // console.log("Hello1");
      //console.log(user.email);
// Order Status Update email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.SENDER_GMAIL_PASSCODE,
  }
});

var mailOptions = {
  from: process.env.SENDER_GMAIL,
  to: user.email,
  subject: 'Order Status update from Medicure',
  text: `Hi ${user.name},
   This is to inform you that your order with Order ID ${order._id} has been ${status}.
Thank You,
Team Medicure`,
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    return res.status(201).send({success: true, message :`Order ${status} successfully`});
  }
});

    //email body ends

    return res.status(201).send({success: true, message : "Order cancelled successfully"});}
    else{
      return res.status(200).send({success: false, message: "Failed to cancel the order"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//All users
export const getAllUsersController = async (req, res) => {
  try {
    console.log("Hi");
    const users = await userModel
      .find({role:"0"});
      console.log("Hello");
      console.log(users);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}

//Dashboard Stats
export const getDashboardStatsController = async (req, res) => {
  try {
    // Get all orders
    const orders = await orderModel
      .find({})
      .populate("products", "price category")
      .sort({ createdAt: -1 });

    // Calculate total sales (sum of all order totalAmount)
    const totalSales = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    // Get total orders count
    const totalOrders = orders.length;

    // Get total users (customers only, role 0)
    const totalUsers = await userModel.countDocuments({ role: "0" });

    // Get total products
    const totalProducts = await productModel.countDocuments();

    // Get total categories
    const totalCategories = await categoryModel.countDocuments();

    // Calculate revenue for last 8 days
    const last8Days = [];
    const today = new Date();
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const dayOrderCount = dayOrders.length;

      last8Days.push({
        date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        revenue: dayRevenue,
        order: dayOrderCount,
      });
    }

    // Calculate monthly revenue and target
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= currentMonth;
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthlyTarget = 600000; // Monthly target in rupees - You can make this configurable
    const monthlyTargetPercentage = Math.round((monthlyRevenue / monthlyTarget) * 100);

    // Get category-wise sales
    // First, get all orders with products populated with category
    const ordersWithCategories = await orderModel
      .find({})
      .populate({
        path: "products",
        populate: {
          path: "category",
          model: "Category"
        }
      });

    const categorySales = {};
    ordersWithCategories.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(product => {
          if (product.category && product.category._id) {
            const catId = product.category._id.toString();
            const catName = product.category.name || "Unknown";
            if (!categorySales[catId]) {
              categorySales[catId] = { total: 0, name: catName };
            }
            categorySales[catId].total += product.price || 0;
          }
        });
      }
    });

    // Convert to array and sort
    const categoryData = Object.values(categorySales)
      .map(cat => ({
        name: cat.name,
        value: cat.total,
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate percentage changes (simplified - comparing with previous period)
    const previousWeekOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 14);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return orderDate >= weekAgo && orderDate < lastWeek;
    });
    const previousWeekSales = previousWeekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const currentWeekOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return orderDate >= lastWeek;
    });
    const currentWeekSales = currentWeekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    const salesChange = previousWeekSales > 0 
      ? (((currentWeekSales - previousWeekSales) / previousWeekSales) * 100).toFixed(2)
      : "0";
    const ordersChange = previousWeekOrders.length > 0
      ? (((currentWeekOrders.length - previousWeekOrders.length) / previousWeekOrders.length) * 100).toFixed(2)
      : "0";

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        totalUsers,
        totalProducts,
        totalCategories,
        monthlyRevenue,
        monthlyTarget,
        monthlyTargetPercentage,
        salesChange: salesChange > 0 ? `+${salesChange}` : salesChange,
        ordersChange: ordersChange > 0 ? `+${ordersChange}` : ordersChange,
        revenueData: last8Days,
        categoryData: categoryData.slice(0, 4), // Top 4 categories
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Dashboard Stats",
      error,
    });
  }
};

// Delivery Address Management Controllers

// Get all delivery addresses
export const getDeliveryAddressesController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.status(200).send({
      success: true,
      addresses: user.deliveryAddresses || [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Getting Addresses",
      error,
    });
  }
};

// Add new delivery address
export const addDeliveryAddressController = async (req, res) => {
  try {
    const {
      name,
      phone,
      pincode,
      locality,
      address,
      city,
      state,
      landmark,
      alternatePhone,
      addressType,
      isDefault,
    } = req.body;

    // Validation
    if (!name || !phone || !pincode || !locality || !address || !city || !state) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const user = await userModel.findById(req.user._id);

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.deliveryAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    const newAddress = {
      name,
      phone,
      pincode,
      locality,
      address,
      city,
      state,
      landmark: landmark || "",
      alternatePhone: alternatePhone || "",
      addressType: addressType || "Home",
      isDefault: isDefault || (user.deliveryAddresses.length === 0),
    };

    user.deliveryAddresses.push(newAddress);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Address Added Successfully",
      addresses: user.deliveryAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Adding Address",
      error,
    });
  }
};

// Update delivery address
export const updateDeliveryAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      name,
      phone,
      pincode,
      locality,
      address,
      city,
      state,
      landmark,
      alternatePhone,
      addressType,
      isDefault,
    } = req.body;

    const user = await userModel.findById(req.user._id);
    const addressIndex = user.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Address not found",
      });
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.deliveryAddresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update the address
    if (name) user.deliveryAddresses[addressIndex].name = name;
    if (phone) user.deliveryAddresses[addressIndex].phone = phone;
    if (pincode) user.deliveryAddresses[addressIndex].pincode = pincode;
    if (locality) user.deliveryAddresses[addressIndex].locality = locality;
    if (address) user.deliveryAddresses[addressIndex].address = address;
    if (city) user.deliveryAddresses[addressIndex].city = city;
    if (state) user.deliveryAddresses[addressIndex].state = state;
    if (landmark !== undefined) user.deliveryAddresses[addressIndex].landmark = landmark;
    if (alternatePhone !== undefined) user.deliveryAddresses[addressIndex].alternatePhone = alternatePhone;
    if (addressType) user.deliveryAddresses[addressIndex].addressType = addressType;
    if (isDefault !== undefined) user.deliveryAddresses[addressIndex].isDefault = isDefault;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Address Updated Successfully",
      addresses: user.deliveryAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating Address",
      error,
    });
  }
};

// Delete delivery address
export const deleteDeliveryAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await userModel.findById(req.user._id);

    user.deliveryAddresses = user.deliveryAddresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: "Address Deleted Successfully",
      addresses: user.deliveryAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Deleting Address",
      error,
    });
  }
};

// Set default delivery address
export const setDefaultAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await userModel.findById(req.user._id);

    // Unset all defaults
    user.deliveryAddresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    const address = user.deliveryAddresses.find(
      (addr) => addr._id.toString() === addressId
    );

    if (!address) {
      return res.status(404).send({
        success: false,
        message: "Address not found",
      });
    }

    address.isDefault = true;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Default Address Updated Successfully",
      addresses: user.deliveryAddresses,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Setting Default Address",
      error,
    });
  }
};



