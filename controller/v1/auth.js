const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../../connection/pool').db;
const uuidv4 =require('uuid').v4;

const saltRounds = 10; //for bcrypt hashing

const register = async (req,res) => {
    const {username,useremail,password,type} = req.body;
    let userType = 0;
    if(type.toLowerCase().includes('seller')){
        userType=1
    }

    let pass;
    //using bcrypt for hashing password before storing
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
            return res.status(500).json('something went wrong with password store')
        }
        db.query('insert into tbl_users(user_name,user_email,password,uid,type) values($1,$2,$3,$4,$5) returning id',[username,useremail,hash,uuidv4(),userType],(error,result) => {
            if (error.code=23505) return res.status(200).json({status : 1, msg : 'user already exists, Please Login'})
            if(error){
                console.log(error.code)
                
                return res.status(500).json('something went wrong with db store')
            }
            let token = jwt.sign({ useremail: useremail,username: username, type, user_id : result.rows[0].id }, process.env.JWT_SECRET);
            return res.status(201).json({'token' : token})
        })
        
    });

    
}

const login = async (req,res) => {
    const {useremail, password} = req.body;

    db.query('select * from tbl_users where user_email=$1',[useremail],(error,reslt) => {
        if(error){
            console.log(error)
            return res.status(500).json('something went wrong with db store')
        }
        // console.log(reslt.rows[0])

        //using same bcrypt for comparing the password and hash to see if its a match
        bcrypt.compare(password, reslt.rows[0].password, function(err, result) {
            if(result){
                let type = reslt.rows[0].type?"seller":"buyer"
                let token = jwt.sign({ useremail: useremail,username: reslt.rows[0].user_name, type: type, user_id: reslt.rows[0].id }, process.env.JWT_SECRET);
                return res.status(200).json({token : token})
            }
            else{
                // console.log(err,result)
                return res.status(401).send('unauthorized')
            }
        });
        
    })
}

module.exports = {
    register,
    login
}