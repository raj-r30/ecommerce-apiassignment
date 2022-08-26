const express = require('express');
const router = express.Router();

const auth = require('./auth');
const buyer = require('./buyer');
const seller = require('./seller');

router.use('/auth',auth.router);
router.use('/buyer',buyer.router);
router.use('/seller',seller.router);

module.exports={router};