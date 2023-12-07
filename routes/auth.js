const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

router.get('/login' ,authController.getLogin );
router.post('/login', authController.postLogin );
router.get('/logout', authController.getLogout);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/verify-email', authController.verifyEmail);
router.post('/verify-email', authController.postVerifyEmail);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);




module.exports = router;