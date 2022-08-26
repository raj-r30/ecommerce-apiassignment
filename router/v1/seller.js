const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({}); //for validating schema of request
const schema = require('../../schema')

const controller = require('../../controller/v1/seller');

router.get('/orders',controller.getOrders);
router.post('/create-catalog',validator.body(schema.catalog),controller.createCatalog);

module.exports={router}