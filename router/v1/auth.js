const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const schema = require('../../schema')


const controller = require('../../controller/v1/auth');

router.post('/register',validator.body(schema.register),controller.register);
router.post('/login',validator.body(schema.login),controller.login);

module.exports={router}