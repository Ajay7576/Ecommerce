
  // creating token and saving in cookie

const sendToken=(user,statusCode,res)=>{
    const token =user.getJwtToken();
    // options for cookies

    const options={
        expires:new Date(    // 7 seven days expire 
            Date.now() + process.env.COOKIE_EXPIRE *24 *60*60*1000
        ),
        httpOnly:true,
    };

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token,
    });
};

module.exports=sendToken;