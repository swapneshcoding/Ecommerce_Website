const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAssyncErrors');
const ApiFeatures = require('../utils/apiFeatures');



// Create Product  --  Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 5;

    const productCount = await Product.countDocuments();

    const ApiFeature = new ApiFeatures({queryFunction: Product.find(), queryStr: req.query}).search().filter().pagination(resultPerPage);

    let products = await ApiFeature.queryFunction;

    res.status(200).json({
        success: true,
        productCount: productCount,
        products
    });
});


// Update a product  --  Admin


exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not Found!", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
});


// Delete a product -- Admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not Found!", 404))
    }

    // product = await Product.findByIdAndDelete(req.params.id);  or
    product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted Successfully!"
    })
});


// Get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not Found!", 404))
    }

    // return res.status(500).json({
    //     success:false,
    //     message:"Product not Found!"
    // })

    res.status(200).json({
        success: true,
        product
    })
});


