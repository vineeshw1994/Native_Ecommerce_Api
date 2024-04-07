import express from 'express';
import {allOrders, creteOrder, getOrders, orderStatus, payment, singleOrder} from '../controllers/orderController.js';
import {isAdmin, isAuth} from '../middlewares/authMiddleware.js';

const router = express.Router();

// create order
router.post('/create', isAuth, creteOrder)

// get all orders
router.get('/myorders', isAuth, allOrders)

//get single order
router.get('/myorder/:id', isAuth, singleOrder)

//accepct payments
router.post('/payments',isAuth, payment)

//*********** admin routes*/
 
// get all orders
router.get('/admin/get-orders',isAuth, isAdmin, getOrders)

// change order status
router.put('/admin/order/:id',isAuth, isAdmin, orderStatus)
export default router; 