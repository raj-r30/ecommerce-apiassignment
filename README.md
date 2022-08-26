# ecommerce-apiassignment
Api Assignment Hybr1d

Please paste the db credentials shared in the mail on .env file to connect. Db used is Postgres, the table schema is given in v1.sql file for referrence.

Free tier postgres db with size of 20 mb and 4 simultaneous connections is used.

The api routes are same as the ones given in the document, However giving sample request urls and request body for api,

1. http://localhost:3200/api/auth/register
    
    {
    "useremail":"rajkumar.r3a@gmail.com",
    "username":"Raj Kumar",
    "password": "pass@123",
    "type":"buyer"
}

2. http://localhost:3200/api/auth/login

    {
    "useremail":"rajkumar.r3a@gmail.com",
    "password": "pass@123"
}

3. http://localhost:3200/api/seller/create-catalog

    {
    "name":"sample catalog",
    "description": "sample desc for rajkumar.r3a catalog",
    "products":[{"name":"p1", "description":"d1"}, {"name":"p2", "description":"d2"}]
}

4. http://localhost:3200/api/buyer/list-of-sellers
5. http://localhost:3200/api/buyer/seller-catalog/1
6. http://localhost:3200/api/buyer//create-order/1
    {
    "name":"sample order",
    "product_ids":[1,2]
}

7. http://localhost:3200/api/seller/orders

/register and /login api gives a jwt token in response, which must be used for all other api for authorization.

for req body schema, Please refer to the Joi schema thats present in the schema.js.

done by rajkumar.r3a@gmail.com

Thank you!