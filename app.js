const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('node:path');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const CronJob = require('cron').CronJob;
const v1 = require('./router/v1/router');
const validator = require('express-joi-validation').createValidator({});
const schema = require('./schema');

let ipBlock={};  //used for storing IP's that reaches rate limit often and this will be reset once in a day

//cron job to reset Ip block at start of each day
let job = new CronJob(
	'0 0 0 * * *',
	function() {
        ipBlock={};
		console.log('Ip block store is resetted');
	}
);
job.start();

//cors middle for adding cors headers
app.use(cors());

//middle for checking if IP has reached rate limiting often and for blocking req from the ip
function blockIP(req,res,next){
    if(ipBlock[req.ip]>3){
        res.status(429).send("Too many requests, Your IP is blocked for 1 day. If you think this is a mistake, Please contact us")
    }
    else{
        next();
    }
}

app.use(blockIP)

//limiter middleware to prevent DOS attack, restricts an ip to 30 api calls per minute
const limiter = rateLimit({
	windowMs: 1* 60 * 1000, // 1 minutes
	max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) =>{
        if(ipBlock[request.ip]){
            ipBlock[request.ip]=ipBlock[request.ip]+1
        }
        else{
            ipBlock[request.ip]=1
        }  
        response.status(options.statusCode).send("Please try after "+new Date(options.store.resetTime))
    }
		
}) //for storing in to ip block when an ip exceeds the rate.

app.use(limiter)

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//using hpp library to prevent express header population polution vulnerability
app.use(hpp());

//using helmet library for securing the app by adding various standard headers
const helmet = require("helmet");
app.use(helmet());

// create a rotating write stream for using in logger 
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
  })
  
// setting up logger with custom format to log all req and response just before sending response.
app.use(morgan(':date[iso] :method :url :referrer :remote-addr :remote-user :req[header] :response-time[digits] :status', { stream: accessLogStream }));

app.use((req,res,next) => {
    // console.log(req.url)
    let ignoreRoutes=['/', '/register']
    if(!ignoreRoutes.includes(req.url)){
         validator.headers(schema.auth)(req,res,next); //for validating auth headers of request
    }
    else{
        next()
    }
    
})


app.use('/api', v1.router); //using v1 router for v1 routes

app.get('/',(req,res) => {
    res.status(200).json('welcome to api')
})
  


app.listen(port, () => console.log(`App listening on port ${port}!`));