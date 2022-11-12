const mongoose=require("mongoose");
const validator=require("validator");

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[30,"name cannot exceed 30 characters"],
        minLength:[4,"Name Should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8,"Password Should be greater than 8 characters"], 
        select:false // password ko chod k baaki information de degaa

    },
    avatar:
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
          }
        },
        role:{
            type:String,
            default:"user"  // jab tak hum admin ni bnaye tab tak voh user he rhe
        },

        createdAt:{
            type:Date,
            default:Date.now,
        },

        resetPasswordToken:String,
        resetPasswordExpire:Date,
    
});

//event  or encyption password

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){  // ni huya modified toh ye
        next();
    }
    this.password=await bcrypt.hash(this.password,10)  //modified condition // password change encrypt
});

// Jwt token

userSchema.methods.getJwtToken = function() {

    return jwt.sign({ id: this._id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

// compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await  bcrypt.compare(enteredPassword,this.password);
}
 
// Generating password Reset Token

userSchema.methods.getResetPasswordToken=function(){
    
    // Generating Token
    const resetToken=crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now() + 15 * 60 * 1000;  // expire 15 min

    return resetToken;
}


module.exports=mongoose.model("User",userSchema);