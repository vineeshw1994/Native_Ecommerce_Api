import express from 'express'
import {isAuth} from '../middlewares/authMiddleware.js'
import { singleUpload} from '../middlewares/multer.js'
import { createProduct, deleteImage, getAllProducts, getTopProducts, getsingleProduct, productDelete, ratingReview, updateProduct, updateProductImage, } from '../controllers/productController.js'

const router = express.Router()

//get all products
router.get('/getproducts', getAllProducts)

//get top product
router.get('/top', getTopProducts)

//get single product
router.get('/:id',getsingleProduct)

// create product 
router.post('/create',isAuth, singleUpload, createProduct)

// update product
router.put('/:id',isAuth, updateProduct)

// update product image
router.put('/image/:id',isAuth, singleUpload, updateProductImage)

//delete product image
router.delete('/image/:id',isAuth, deleteImage)

// delete product
router.delete('/:id',isAuth, productDelete)

// review product
router.put('/:id/review',isAuth, ratingReview)
export default router