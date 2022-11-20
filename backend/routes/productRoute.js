const express = require('express');
const { getAllProducts , createProduct, updateProduct, deleteProduct, getProductDetails} = require('../controllers/productController');
const { isAuthenticatedUser, isAuthorizedRole } = require('../middleware/authentication');
const router = express.Router();


router.route('/products').get(getAllProducts);


router.route('/product/new').post(isAuthenticatedUser, isAuthorizedRole("admin"), createProduct);

router.route('/product/:id')
.put(isAuthenticatedUser, isAuthorizedRole("admin"), updateProduct)
.delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteProduct)
.get(getProductDetails);


module.exports = router;