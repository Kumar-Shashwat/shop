const express = require('express');
const router = express.Router();
const path = require('path');

const productsController = require('../controller/admin');
const isAuth = require('../middlewares/isAuth');


// /admin/add-phone => get request.
router.get('/add-product', isAuth, productsController.getAddProducts);

// /admin/add-phone => get request.
router.post('/add-product', isAuth, productsController.postAddProduct);

router.get('/edit-product/', isAuth,  productsController.getAddProducts)
// /admin/edit-phone => get request.
router.get('/edit-product/:productId' , isAuth, productsController.editProduct );
router.post('/edit-product/:productId', isAuth, productsController.postEditProduct);

// /admin/delete ==> post request
router.post('/delete/:productId', isAuth, productsController.deleteProduct);
// router.delete('/product/:productId', isAuth, productsController.deleteProduct);

// /admin/add-phone => get request.
router.get('/products' , isAuth, productsController.adminProducts);

module.exports.router = router; 