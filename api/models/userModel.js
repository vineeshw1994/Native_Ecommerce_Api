import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, " username is required"]
    },
    email: {
        type: String,
        required: [true, " email is required"],
        unique: [true, " email already exists"]
    },
    password: {
        type: String,
        required: [true, " password is required"],
        minLength: [6, " password must be at least 6 characters"]
    },
    profilePic: {
        public_id:{
            type: String
        },
        url:{
            type:String
        },
       
    },
    role:{
     type:String,
     default:"user"
    },
    address: {
        type: String,
        required: [true, " address is required"]
    },
    city: {
        type: String,
        required: [true, " city is required"]
    },
    phone: {
        type: Number,
        required: [true, " phone is required"]
    }
},{timestamps: true});


 const User = mongoose.model("User", userSchema); 
 export default User;

