import express from 'express';
import { register,login, userProfile, logout, updateProfile,updatePicture } from '../controllers/userController.js';
import {isAuth} from '../middlewares/authMiddleware.js'
import { singleUpload} from '../middlewares/multer.js'
import {rateLimit} from 'express-rate-limit'

const router = express.Router();

//rate limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

//routes
router.post('/register',limiter, register);
router.post('/login',limiter, login);

//profile
router.get('/profile' , isAuth, userProfile)

//logout
router.get('/logout', isAuth, logout)

//update profile
router.put('/profile-update', isAuth, updateProfile)

//update profile picture
router.put('/update-picture',isAuth,singleUpload,updatePicture)
 
export default router;