import productModel from '../models/productModel.js';
import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/features.js'

//get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category')
        res.status(200).json({ totalProducts: products.length, products, success: true, message: 'all products fetched successfully', })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in all products  Api', success: false, error })
    }
}

//  getTopProducts
export const getTopProducts = async (req, res) => {
    try {
        const products = await productModel.find({ rating: { $gt: 2 } }).sort({ rating: -1 }).limit(3)
        res.status(200).json({ products, success: true, message: 'top products fetched successfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in top products  Api', success: false, error })
    }
}
export const getsingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const product = await productModel.findById()
        res.status(200).json({ product, success: true, message: 'single product fetched successfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in single product Api', success: false, error })
    }
}

// create product
export const createProduct = async (req, res) => {
    console.log('this is the create product')
    try {
        console.log(req.body)
        const { name, description, price, category, stock } = req.body
        // if (!name || !description || !price || !category || !stock) {
        //     return res.status(400).json({ message: 'Please fill all the fields', success: false })
        // }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image', success: false })
        }
        const file = getDataUri(req.file)
        const cbd = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cbd.public_id,
            url: cbd.secure_url
        }
        await productModel.create({ name, description, price, category, stock, images: [image] })


        res.status(201).json({ message: 'Product created successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in create product Api', success: false, error })
    }
}

// update product
export const updateProduct = async (req, res) => {
    console.log('this is the update product function')
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }
        const { name, description, price, category, stock } = req.body

        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (stock) product.stock = stock
        if (category) product.category = category

        await product.save()
        res.status(200).json({ message: 'Product updated successfully', success: true })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in update product Api', success: false, error })
    }
}

// update product image
export const updateProductImage = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }
        if (!req.file) {
            return res.status(404).json({ message: 'No file uploaded', success: false })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        product.images.push(image)
        await product.save()
        res.status(200).json({ message: 'Product image updated successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in update product image Api', success: false, error })
    }
}

//delete image
export const deleteImage = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }

        const id = req.query.id
        if (!id) {
            return res.status(400).json({ message: 'Image id is required', success: false })
        }
        let exist = -1
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) {
                exist = index
            }
        })
        if (exist < 0) {
            return res.status(404).json({ message: 'Image not found', success: false })
        }
        await cloudinary.v2.uploader.destroy(product.images[exist].public_id)
        product.images.splice(exist, 1)
        await product.save()
        res.status(200).json({ message: 'Product image deleted successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in delete product image Api', success: false, error })
    }
}

export const productDelete = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne()
        res.status(200).json({ message: 'Product deleted successfully', success: true })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in delete product  Api', success: false, error })
    }
}

// rating review
export const ratingReview = async (req, res) => {
    console.log('this is the rating review function')
    try {
        const { rating, comment, } = req.body
        const product = await productModel.findById(req.params.id)
        const alreadyReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        )
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed', success: false })
        }

        const review = {
            name: req.user.username,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(200).json({ message: 'Review added successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error in rating review Api', success: false, error })
    }
}