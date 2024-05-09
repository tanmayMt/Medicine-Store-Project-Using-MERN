import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
//import addressModel from "../models/addressModel.js";
//import productModel from "../models/productModel.js";
//import cartModel from "../models/cartModel.js";

export const profile = async(req, res) => {
    try{
        const user = await userModel.findOne({_id: req.body.id});
        user.password = null;
        return res.status(200).send({success: true, user});

    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to fetch profile details',
            error
        })
    }
}

export const updateProfile = async(req, res) => {
    try{
        const user = await userModel.findOne({_id: req.body.id});
        const duplicateEmail = await userModel.findOne({email: req.body.email});
        const duplicatePhone = await userModel.findOne({phone: req.body.phone});
        if(!duplicateEmail && !duplicatePhone)
        {
            const updateuser = await userModel.findByIdAndUpdate({_id: req.body.id}, req.body);
            if(updateuser)
            {
                return res.status(201).send({success: true, message:"Profile updated successfully."});
            }
        }else{
    return res.status(200).send({success: false, message:"Email or phone already exists, please use other details."})}
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to fetch profile details',
            error
        })
    }
}

export const searchProducts = async(req, res) => {
    try{
        
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to search for the products',
            error
        })
    }
}

export const addToCart = async(req, res) => {
    try{
        const stockcheck = await productModel.findOne({productID: req.body.productID});
        if(stockcheck.stock == 0)
        {
            return res.status(200).send({success: false, message : "This product is out of stock."})
        }
        else if(req.body.quantity>stockcheck.stock)
        {
            return res.status(200).send({success: false, message: `Failed to add product as you can only add upto ${stockcheck.stock} quantities of this product`})
        }
        else{
            const cart = new cartModel(req.body);
            await cart.save();
            return res.status(201).send({success: true, message: "Product added successfully."});
        }
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to add to cart',
            error
        })
    }
}

export const updateCart = async(req, res) => {
    try{
        if(req.body.action == "Update")
        {
            const stockcheck = await productModel.findOne({productID: req.body.productID});
        if(stockcheck.stock == 0)
        {
            return res.status(200).send({success: false, message : "This product is out of stock."})
        }
        else if(req.body.quantity>stockcheck.stock)
        {
            return res.status(200).send({success: false, message: `Failed to update the quantity you can only add upto ${stockcheck.stock} quantities of this product wth product ID}`})
        }
        else{
            const cart = new cartModel(req.body);
            await cart.save();
            return res.status(201).send({success: true, message: "Product added successfully."});
        }
        }
        
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to update cart',
            error
        })
    }
}

export const showAddress = async(req, res) => {
    try{
        const listOfAddress = await addressModel.find({userID: req.body.userId, status: "Active"})
        if(!listOfAddress)
        {
            return res.status(200).send({message: "No address found"});
        }
        return res.status(200).send({success: true, message: "Address Found", listOfAddress});
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to get the addresses',
            error
        })
    }
}

export const addAddress = async(req, res) => {
    try{
        const address = new addressModel(req.body);
        await address.save();
        return res.status(201).send({success: true, message: "Address added"});
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: 'Failed to add address',
            error
        })
    }
}

export const editAddress = async(req, res) => {
    try{
        const add = await addressModel.findByIdAndUpdate({_id: req.body.id}, req.body);
        if(add){
        return res.status(201).send({success: true, message: `Address has been ${req.body.status}d`});
        }
    }catch(error)
    {
        console.log(error);
        res.status(501).send({
            success: false,
            message: `Failed to ${req.body.status} the address`,
            error
        })
    }
}