const express = require('express');
const router = express.Router();
const path = require('path');
const errorController = require('../controller/error');

// router.use ();
router.get('/500', errorController.error500)
router.use(errorController.error404);

// router.get('/500', (req, res, next))

module.exports = router;     