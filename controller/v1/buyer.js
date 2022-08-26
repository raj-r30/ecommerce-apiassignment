const db = require('../../connection/pool').db;
var jwt = require('jwt-decode');
require('dotenv').config();
const format = require('pg-format');


const getCatalog = async (req,res) => {
    const sellerId = req.params.seller_id;
    db.query('select c.*,json_agg(p.*) as products from tbl_catalog c join tbl_products p on c.id=p.catalog_id where c.user_id=$1 group by c.id order by c.id asc',[sellerId],(error,reslt) => {
        if(error){
            console.log(error)
            return res.status(500).json('something went wrong with db store')
        }
        // console.log(reslt.rows[0])
        return res.status(200).json({catalog : reslt.rows})
    })

}

const createOrder = async (req,res) => {
    var decoded = jwt(req.headers.authorization.split(' ')[1]);
    const {name,product_ids} = req.body;

    //using transaction begin,commit for inserting multiple rows in multiple tables so that either all will be inserted or no rows will be entered
    db.connect((err, client, done) => {
        if(err){
            console.log(err);
            return res.status(500).json('something went wrong with db store')
        }
        const shouldAbort = err => {
          if (err) {
            console.error('Error in transaction', err.stack)
            client.query('ROLLBACK', err => {
              if (err) {
                console.error('Error rolling back client', err.stack)
              }
              // release the client back to the pool
              done()
            })
            return res.status(500).json('something went wrong with db store')
          }
          return !!err
        }
        client.query('BEGIN', err => {
          if (err ) return shouldAbort(err);
          const queryText = 'insert into tbl_orders(buyer_id,name,seller_id) values($1,$2,$3) returning id'
          client.query(queryText, [decoded.user_id,name,req.params.seller_id], (err, result) => {
            if (err ) return shouldAbort(err);
            let values=[];
            product_ids.forEach((p)=>{
                values.push([result.rows[0].id,p])
            })
            let queryProducts=format('INSERT INTO tbl_order_list (order_id,product_id) VALUES %L',values);
            client.query(queryProducts, [], (err, reslt) => {
              if (err ) return shouldAbort(err);
              client.query('COMMIT', err => {
                if (err) {
                  console.error('Error committing transaction', err.stack)
                  return res.status(500).json('something went wrong with db store')
                }
                done();
                res.status(201).json({'order_id':result.rows[0].id})
              })
            })
          })
        })
      })

}

const listSellers = async (req,res) => {
    const {useremail, password} = req.body;

    db.query('select user_name as sellername,user_email as seller_email,uid from tbl_users where type=1',[],(error,reslt) => {
        if(error){
            // console.log(error)
            return res.status(500).json('something went wrong with db store')
        }
        // console.log(reslt.rows[0])
        return res.status(200).json({sellers : reslt.rows})
    })
}

module.exports = {
    getCatalog,
    createOrder,
    listSellers
}