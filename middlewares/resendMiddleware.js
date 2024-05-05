import jwt from "jsonwebtoken";

export const verifyuserandResend = async (req,res,next) => {
    try {
        // console.log("HiAll1 ");
        // console.log(req);
        // console.log(" HiAll2 ");
        const token = req.body.headers['Authorization'].split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body = decode;
        next();  
    } catch (error) {
       console.log(error); 
    }
};