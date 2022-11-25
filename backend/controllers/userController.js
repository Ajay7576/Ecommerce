const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const cloudinary = require("cloudinary");



// Register a user

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    
    const {name,email,password} =req.body;
    const user= await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })

    sendToken(user,201,res);

});

// login User
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const{email,password}=req.body;

    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please enter Email & Password",400));
    }

    const user= await User.findOne({email}).select("+password");   //find user database

    if(!user){  // user nhi mila toh
        return next(new ErrorHandler("Invalid Email & Password",401));
    }

    const isPasswordMatched=user.comparePassword(password); // jo user mil gya h fir uska password match kre ge

    if(!isPasswordMatched){  //password match ni huaa toh yeh condition
        return next(new ErrorHandler("Invalid Email & Password",401));
    }

    // const token =user.getJwtToken();  // file jwttoken.js
    // res.status(200).json({
    //     success:true,
    //     token,
    // });
     
    sendToken(user,200,res);

});

// LogOut User

exports.logout=catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null, {
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})

// Forgot Password

exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findOne({email:req.body.email});  // email k through

    if(!user){                                     // nhi h toh 
        return next(new ErrorHandler("User not found",404));
    }

    // Get ResetPassword  Token

    const resetToken= user.getResetPasswordToken();

     await user.save({validateBeforeSave: false});

// email k liye
 const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

     const message=`Your password reset token is
     :-\n\n ${resetPasswordUrl} \n\n if you have not requested this email when please ignore it `;

     try {

        await sendEmail({
            email:user.email,
            subject:`Jayoti_Jasrotia.Com Password Recovery`,
            message,
        });


        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
        
     } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500));
     }
});

// Reset Password
// token sey access

exports.resetPassword= catchAsyncErrors(async(req,res,next)=>{


    console.log(req.params.token);

    // creating token hash
    const resetPasswordToken=
    crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex");


    // find hastoken in database

    const user = await User.findOne({  // user mil jaaye gaa
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() } // $gt greater than
    });

    console.log(user);
    

    if(!user){                                     // nhi h toh 
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404));
    }

    if(req.body.password !== req.body.confirmPassword){ // new password ! to old password
         return next(new ErrorHandler("Password does not password",400));
    }
    
    user.password=req.body.password;  // successfully change password

    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

     await user.save();
     sendToken(user,200,res);

});

// Get User Detail
// login bnda he use kr skta

exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id)
    console.log(user);

    res.status(200).json({
        success:true,
        user,
    });
});

// Update User Password

exports.updateUserPassword=catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched=user.comparePassword(req.body.oldPassword); // jo user mil gya h fir uska password match kre ge

    if(!isPasswordMatched){  //password match ni huaa toh yeh condition
        return next(new ErrorHandler("old password is incorrect",400));
    }

     
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }


    user.password=req.body.newPassword;
     await user.save();
     
     sendToken(user,200,res);
});


// User Profile Update 
 
exports.updateUserProfile=catchAsyncErrors(async(req,res,next)=>{

   const newUserData={
    name:req.body.name,
    email:req.body.email,
   };

   //  add cloudinary

   if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

     
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
   });

   if(!user){
    return next(new ErrorHandler(`user does not exist with`));
}
  
   res.status(200).json({
    success:true,
   });
     
});




// GetAll Users
exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{

    const users=await User.find(); // all user find
    res.status(200).json({
        success:true,
        users,
       });

});


// Get single user --admin

exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.params.id); // user find

    if(!user){
        return next(new ErrorHandler(`user does not exist with Id:${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user,
       });

});


// Update User Role  --admin
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
     name:req.body.name,
     email:req.body.email,
     role:req.body.role,
    };
       
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
    });
   
    res.status(200).json({
     success:true,
    });
      
 });

// Delete User Role    --admin
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
      

    const user=await User.findById(req.params.id);

    // will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`user does not exist with Id:${req.params.id}`));
    }
    await user.remove();

    res.status(200).json({
     success:true,
     message:"User Deleted Successfully",
    });
      
 });
 


