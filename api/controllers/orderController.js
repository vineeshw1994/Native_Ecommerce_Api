import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { stripe } from "../server.js";

// create order
export const creteOrder = async (req, res) => {
    console.log('this is order function')
    try {
        const { shippingInfo, orderItems, itemPrice, tax, shippingCharges, totalAmount } = req.body
        // if (!shippingInfo || !orderItems  || !itemPrice || !tax || !shippingCharges || !totalAmount) {
        //     return res.status(400).json({ message: 'all fields are required' })
        // }

        if (!shippingInfo) {
            return res.status(400).json({ message: 'shippingInfo field is required' });
        }
        if (!orderItems) {
            return res.status(400).json({ message: 'orderItems field is required' });
        }

        if (!itemPrice) {
            return res.status(400).json({ message: 'itemPrice field is required' });
        }
        if (!tax) {
            return res.status(400).json({ message: 'tax field is required' });
        }
        if (!shippingCharges) {
            return res.status(400).json({ message: 'shippingCharges field is required' });
        }
        if (!totalAmount) {
            return res.status(400).json({ message: 'totalAmount field is required' });
        }


        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
        })

        for (let i = 0; i < orderItems.length; i++) {
            let product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity
            await product.save()
        }
        res.status(201).json({ message: 'order placed successfully', success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'order api error', success: false, error })
    }
}

// get all orders
export const allOrders = async (req, res) => {
    console.log('this is order function')
    try {
        const id = req.user._id

        const orders = await orderModel.find({ user: id })
        if (!orders) {
            return res.status(404).json({ message: 'no orders found', success: false })
        }
        res.status(200).json({ message: 'all orders', success: true, orders, totalOrders: orders.length })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: ' my orders api error', success: false, error })
    }
}

// get single order
export const singleOrder = async (req, res) => {
    console.log('this is single-order function')
    console.log(req.params.id)
    try {

        const order = await orderModel.findById(req.params.id.trim())
        if (!order) {
            return res.status(404).json({ message: 'no order found', success: false })
        }
        res.status(200).json({ message: 'single order', success: true, order })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'my-order api error', success: false, error })
    }
}

// accepct payments

export const payment = async (req, res) => {
    try {
        const {totalAmount} = req.body
        if(!totalAmount){
            return res.status(400).json({ message: 'total amount is required' })
        }
       const {client_secret} = await stripe.paymentIntents.create({
            amount:Number(totalAmount + '00'),
            currency: 'inr',
        })
        res.status(200).json({ message: 'payment successful', success: true,client_secret })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'payment api error', success: false, error })
    }
}



//************admin section *****************/
//admin get orders
export const getOrders = async (req, res) => {
    console.log('this is admin-order function')
    try {
        const orders = await orderModel.find({})
        if (!orders) {
            return res.status(404).json({ message: 'no orders found', success: false })
        }
        res.status(200).json({ message: 'all orders', success: true, orders, totalOrders: orders.length })
    }catch(error){
        console.log(error.message)
        res.status(500).json({ message: 'admin-orders api error', success: false, error })
    }
}

// change order status
export const orderStatus = async (req, res) => {
    console.log('this is admin-order function')
    try {
        const {status} = req.body
       const order = await orderModel.findById(req.params.id)
       if(!order){
        return res.status(404).json({ message: 'no order found', success: false })
       }
       if(order.orderStatus === 'delivered'){
        return res.status(400).json({ message: 'order is already delivered', success: false })
       }
       if(status === 'processing'){
        order.orderStatus = 'shipped'
       }
       if(status === 'shipped'){
        order.orderStatus = status
       }
       if(status === 'delivered'){
        order.orderStatus = status
        order.deliveredAt = Date.now()
       }
       await order.save()
       res.status(200).json({ message: 'order status updated', success: true, order })
    }catch(error){
        console.log(error.message)
        res.status(500).json({ message: 'admin-orders api error', success: false, error })
    }
}