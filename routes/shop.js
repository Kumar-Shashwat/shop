const express = require('express');
const router = express.Router();
const path = require('path');

const shopController = require('../controller/shop');

// router.get('/shop/index', shopController.index);
router.get('/product-list', shopController.shopGallery);

// router.get('/product/delete', );
router.get('/product-details/:prodId', shopController.productDetials);
router.get('/', shopController.index);

 
module.exports = router;