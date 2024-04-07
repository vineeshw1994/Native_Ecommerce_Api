import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import testRoutes from './routes/testRoute.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import orderRoutes from './routes/orderRoute.js'
import connectDB from './config/db.js';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';


dotenv.config(); 

//connect to database
connectDB();

//stripe config
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
})

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


//routes
app.use('/api', testRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running'.bgMagenta.white);
})