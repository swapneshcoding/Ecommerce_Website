const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const { isAuthenticatedUser, isAuthorizedRole } = require('../middleware/authentication');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser,myOrders);

router.route('/admin/orders').get(isAuthenticatedUser, isAuthorizedRole('admin'), getAllOrders);

router.route('/admin/order/:id')
.put(isAuthenticatedUser, isAuthorizedRole('admin'),updateOrder)
.delete(isAuthenticatedUser, isAuthorizedRole('admin'),deleteOrder);


module.exports = router;