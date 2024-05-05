import jwt from "jsonwebtoken";

export const verifyuser = async (req,res,next) => {
    try {
        // console.log("HiAll1 ");
        // console.log(req);
        // console.log(" HiAll2 ");
        const token = req.body.headers['Authorization'].split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body = decode;
        if(req.body.newUser=="True")
        {
            next();
        }     
    } catch (error) {
       console.log(error); 
    }
};

export const verifyolduser = async (req,res,next) => {
    try {
        //  console.log("HiAll1 ");
        //  console.log(req.body);
        // console.log(" HiAll2 ");
        const token = req.body.headers['Authorization'].split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.email = decode.email;
        req.body.password = req.body.formData.password;
        if(decode.newUser=="False")
        {
            next();
        }     
    } catch (error) {
       console.log(error); 
    }
};

export const resetolduser = async (req,res,next) => {
    try {
        //  console.log("HiAll1 ");
        //  console.log(req.body);
        // console.log(" HiAll2 ");
        const token = req.body.headers['Authorization'].split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Hello Kuntal");
        req.body.email = decode.email;
        // console.log(req.body);
        if(decode.newUser=="False")
        {
            next();
        }     
    } catch (error) {
       console.log(error); 
    }
};