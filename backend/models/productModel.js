const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:[true, "Please enter product Name"]
    },
    description:{
        type:String, 
        required:[true, "Please enter product Description"]
    },
    price:{
        type:Number, 
        required:[true, "Please enter product Price"],
        maxLength:[8, "Price can't exceed 8 digits"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    category:{
        type:String,
        required:[true, "Please enter product Category"]
    },
    stock:{
        type:Number,
        required:[true, "Please enter product Stock"],
        maxLength:[4, "Stock can't exceed 4 digits"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Product", productSchema);