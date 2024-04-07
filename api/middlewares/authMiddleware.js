import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//user Auth
export const isAuth = async (req, res, next) => {
  const token = req.cookies.access_token  
  console.log('this is the token ', token)
  if(!token){
    return res.status(401).json({message: "You are not authenticated",secure: false});
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('this is decode ',decoded)
    req.user = await userModel.findById(decoded.id).select("-password");
    // console.log('this is req.user ',req.user)
    next();
  }catch(error){
    console.log(error.message)
    return res.status(401).json({message: "Invalid token",secure: false});
  }
}

//admin Auth  
export const isAdmin = async (req, res, next) => {
  if(req.user.role !== "admin"){
    return res.status(401).json({message: "admin only",secure: false});
  }
  next();
}