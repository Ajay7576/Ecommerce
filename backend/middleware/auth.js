const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");

exports.isAuthenticatedUser=catchAsyncErrors(async (req,res,next)=>{

    const {token}=req.cookies;
    
      if(!token){   // token nhi huyaa toh
        return next(new ErrorHandler("Please Login to access this resource",401));
      }

      // h toh yeh condition
      const decodedData=jwt.verify(token,process.env.JWT_SECRET);  // decoded data
      req.user= await User.findById(decodedData.id);
      
     next();
});

exports.authorizeRoles = (...roles)=>{  // admin access
    return(req,res,next)=>{
        // admin nhi h toh yeh condition nhi toh skip
        if(!roles.includes(req.user.role)) //user include nhi h
       {
        return next(new ErrorHandler(`Role:${req.user.role} is not allowed to access this resource`,403));
        };

        next();
       
    };
};