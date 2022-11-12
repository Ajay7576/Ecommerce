
const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");




// create Product--admin

exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});


//  GET all products

exports.getAllProducts=catchAsyncErrors(async(req,res,next)=>{

const resultPerPage=8;
const productsCount= await Product.countDocuments();
// api feature search filter pagination
const apiFeatures= new ApiFeatures(Product.find(),req.query)
.search()
.filter();

 let products = await apiFeatures.query;

 let filteredProductsCount=products.length;

 apiFeatures.pagination(resultPerPage);

  products = await apiFeatures.query.clone();

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
});


// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });




// Get Single Product details

exports.getProductDetails=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
        }
    res.status(200).json({
        success:true,
        product
    })
})

// update Product -- Admin

exports.updateProduct=catchAsyncErrors(async (req,res,next)=>{
    let product= await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }

// next call back function

    if(!product){
    return next(new ErrorHandler("Product not found",404));
    }


// Images Start Here
let images = [];

if (typeof req.body.images === "string") {
  images.push(req.body.images);
} else {
  images = req.body.images;
}

if (images !== undefined) {
  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
}

    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

// delete Product 

exports.deleteProduct=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
        }


         // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }


    await product.remove();
    res.status(200).json({
        success:true,
        message:"product delete successfully"
    })
});


// Create New Review or update The review

exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{

    const {rating,comment,productId}=req.body;

    const review={            // object
        user:req.user._id,
         name:req.user.name,
         rating:Number(rating),
         comment,
    };

    const product =await Product.findById(productId);

    const isReviewed=product.reviews
    .find(rev=>rev.user.toString()===req.user._id.toString());  
   
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
            rev.rating=rating,
            rev.comment=comment
        });
    }
    else{
        product.reviews.push(review);
        product.numofReviews=product.reviews.length
    }

  // average
    let avg=0;
    // product.ratings=avg    // total
    // /product.reviews.length;

    product.reviews.forEach((rev)=>{
        avg+=rev.rating;

    });

    product.ratings=avg / product.reviews.length;
  
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,  
    });
});


//   Get All Reviews of a Product

exports.getProductReviews=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product){
        return next (new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true, 
        reviews:product.reviews, 
    });
});


// delete review 

exports.deleteReview=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product){
        return next (new ErrorHandler("Product not found",404));
    }

    const reviews =product.reviews.filter(rev=>rev._id.toString()!==req.query.productId.toString());

    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;
    });

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numofReviews=reviews.length;

    
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    );

    res.status(200).json({
        success:true,  
    })

});