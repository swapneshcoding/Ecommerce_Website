const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

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
