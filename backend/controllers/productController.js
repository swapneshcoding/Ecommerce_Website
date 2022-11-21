const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');



// Create Product  --  Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user._id;

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


// Create new review or update a review

exports.createProductReview = catchAsyncErrors(async (req, res, next) =>{
    const {rating, comment, productId} = req.body;


    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());

    // console.log("isReviewed:", isReviewed);

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating,
                rev.comment = comment
            }
        })
    }
    else{
        product.reviews.push(review);
    }

    product.numberOfReviews = product.reviews.length;

    let avg = 0;
    product.reviews.forEach(rev=>{
        avg += rev.rating
    })

    product.rating = avg/product.numberOfReviews;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        product
    })
});


// Get all reviews of a product

exports.getProductReviews = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product)
        return next(new ErrorHandler("Product not Found", 404));
    
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
})

// Delete product review
// may add delete by user_id

exports.deleteProductReview = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product)
        return next(new ErrorHandler("Product not Found", 404));
    
    const reviews = product.reviews.filter(rev=>rev._id.toString()!=req.query.reviewId.toString());


    const numberOfReviews = reviews.length;

    let avg = 0;
    reviews.forEach(rev=>{
        avg += rev.rating
    })

    const rating = avg/numberOfReviews;

    await Product.findByIdAndUpdate(req.query.productId, {reviews, numberOfReviews, rating},{new:true, runValidators:true, useFindAndModify:false})


    
    res.status(200).json({
        success:true,
    })
});