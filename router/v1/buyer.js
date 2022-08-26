const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({}); //for validating schema of request
const schema = require('../../schema')

const controller = require('../../controller/v1/buyer');

router.get('/list-of-sellers',controller.listSellers);
router.get('/seller-catalog/:seller_id',validator.params(schema.seller_id),controller.getCatalog);
router.post('/create-order/:seller_id',validator.body(schema.orders),validator.params(schema.seller_id),controller.createOrder);

module.exports={router}