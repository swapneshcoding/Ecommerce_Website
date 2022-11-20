// only authenticated user can access certain features

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


exports.isAuthenticatedUser = catchAsyncErrors( async(req, res, next)=>{

    const {token} = req.cookies;

    if(!token)
        return next(new ErrorHandler("Please Login to Access this Resource", 401));
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    console.log(req.user);

    next();
})

exports.isAuthorizedRole  = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role))
            return next(new ErrorHandler(`${req.user.role} is not authorized to access the resource`, 403));
        
        next();
    };
}