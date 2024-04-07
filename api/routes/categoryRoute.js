import express from 'express'
import { isAuth } from '../middlewares/authMiddleware.js';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/categoryController.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router()

// create category
router.post('/create',isAuth,singleUpload, createCategory)

// all category
router.get('/all-category', getAllCategory)

//delete category
router.delete('/delete/:id', isAuth, deleteCategory) 

// update category
router.put('/update/:id', isAuth, updateCategory)


export default router;