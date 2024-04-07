import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required']
        },
        city: {
            type: String,
            required: [true, 'city is required']
        },
        country: {
            type: String,
            required: [true, 'country is required']
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'product is required']
            },
            price: {
                type: Number,
                required: [true, 'price is required']
            },
            quantity: {
                type: Number,
                required: [true, 'quantity is required']
            },
            stock: {
                type: Number,
                required: [true, 'stock is required']
            },
            image: {
                type: String,
                required: [true, 'image is required']
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    paymentMethod: {
        type: String,
        enum:['COD', 'ONLINE'],
        default:'COD',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id is required']
    },
    paidAt:Date,
    paymentInfo:{
        id:String,
        status:String,
    },
    itemPrice: {
        type: Number,
        required: [true, 'item price is required']
    },
    tax: {
        type: Number,
        required: [true, 'item tax is required']
    },
    shippingCharges: {
        type: Number,
        required: [true, 'shipping charges is required']
    },
    totalAmount: {
        type: Number,
        required: [true, 'total amout  is required']
    },
    orderStatus: {
        type: String,
        enum:[ 'processing', 'shipped', 'delivered', 'cancelled'],
        default:'processing',
    },
    deliveredAt:Date,

}, { timestamps: true })

const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;