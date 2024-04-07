import mongoose from "mongoose";
import userModel from "./userModel.js";

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please enter product name"]
    }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: String,
        required: [true, "Please enter product price"]
    },
    stock: {
        type: String,
        required: [true, "Please enter product stock"]
    },
    // quantity:{
    //     type:String,
    //     required: [true, "Please enter product quantity"]
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    images: [{
        public_id: String,
        url: String
    }],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


const productModel = mongoose.model("Product", productSchema);
export default productModel;