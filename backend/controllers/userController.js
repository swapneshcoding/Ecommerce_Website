const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');

const User = require('../models/userModel');

// Register a user

exports.registerUser = catchAsyncErrors( async(req, res, next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id:"sample id",
            url:"profileUrl"
        }
    })

    sendToken(user, res, 201);
});

exports.listAllUsers = catchAsyncErrors( async(req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
});


// LOGIN USER

exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password)
        return next(new ErrorHandler("Please enter Email and Password", 400));
    
    const user = await User.findOne({email:email}).select("+password");

    if(!user)
        return next(new ErrorHandler("Invalid Email or Password", 401));

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched)
        return next(new ErrorHandler("Invalid Email or Password", 401));
    

    sendToken(user, res, 200);

})


// LOGOUT USER

exports.logoutUser = catchAsyncErrors(async (req, res, next)=>{

    res.cookie('token', null, {
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
    })
})


// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user)
        return next(new ErrorHandler("User not Found", 404));

    // get reset Token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    console.log(resetPasswordUrl);

    const message = `Your password reset token is:- \n\n${resetPasswordUrl}\n\nIf you have not requested password reset, please ignore this.`;

    try {
        
        await sendEmail({
            email:user.email,
            subject:`Ecommerce password recovery`,
            message:message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message, 500));
    }

})

// Reset Password

exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
    
    // creating token hash
    const resetPasswordToken = 
        crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user)
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match", ))
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    
    await user.save();
    sendToken(user, res, 200);
})