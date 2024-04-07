import categoryModel from '../models/categoryModel.js';
import productModel from '../models/productModel.js';
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';

export const createCategory = async (req, res) => {
    console.log('this is category function')
    try {
        const { category } = req.body;
        if (!category) {
            return res.status(400).json({ message: 'category is required', success: false })
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image', success: false })
        }
        const file = getDataUri(req.file)
        const cbd = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cbd.public_id,
            url: cbd.secure_url
        }
        await categoryModel.create({ category, image });
        res.status(201).json({ message: 'Category created successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in create category  Api', success: false, error })
    }
}

// all category
export const getAllCategory = async (req, res) => {
    try {
        const categories = categoryModel.find({});
        res.status(200).json({ message: 'All categories fetched successfully', success: true, categories })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in get all category  Api', success: false, error })
    }
}

// category delete
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Category id is required', success: false })

        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found', success: false })
        }
        const products = await productModel.findOne({ category: category._id });

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = undefined
            await product.save();
        }
        await category.deleteOne()
        res.status(200).json({ message: 'Category deleted successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in delete category  Api', success: false, error })
    }
}

// update category
export const updateCategory = async (req, res) => {
    try {
       console.log('this is category update function')
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Category id is required', success: false })

        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found', success: false })
        }
        const {updateCategory} = req.body
        const products = await productModel.findOne({ category: category._id });

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = updateCategory
            await product.save();
            await category.save({ category: updateCategory})
        }
        res.status(200).json({ message: 'Category updated successfully', success: true })  
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({ message: 'Error in update category  Api', success: false, error })
    }
}