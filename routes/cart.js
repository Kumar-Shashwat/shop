const express = require('express');
const router = express.Router();

const cartController = require('../controller/cart');
const isAuth = require('../middlewares/isAuth');

router.get('/cart', isAuth, cartController.getCart);
router.post('/cart', isAuth, cartController.postCart);
router.get('/cart-decrease-count/:prodId', isAuth, cartController.decreaseCount);
router.get('/cart-increase-count/:prodId', isAuth, cartController.increaseCount);
router.post('/remove-item/:prodId', isAuth, cartController.removeItem);
router.get('/cheakout',isAuth, cartController.cheakout );

module.exports = router;