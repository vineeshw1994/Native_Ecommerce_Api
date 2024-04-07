import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:[true, 'Please enter category']
    },
    image:{
        public_id:String,
        url:String,
    }
},{timestamps: true})

const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;