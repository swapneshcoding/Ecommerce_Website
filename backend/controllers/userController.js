const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAssyncErrors');

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

    res.status(201).json({
        success:true,
        user
    })

});

exports.listAllUsers = catchAsyncErrors( async(req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
});
