const Joi = require('joi');

const register = Joi.object({ 
    username:Joi.string().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9_@]{7,14}$')).required(),
    useremail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    type : Joi.string().required()
})

const login = Joi.object({
    password: Joi.string().required(),
    useremail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})

const catalog = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    products: Joi.array().required()
})

const orders = Joi.object({
    name: Joi.string(),
    product_ids: Joi.array().required()
})

const seller_id = Joi.object({
    seller_id: Joi.number().required()
})


const auth = Joi.object({
    authorization : Joi.string().required()
})

module.exports = {
    register,
    login,
    catalog,
    orders,
    seller_id,
    auth
}