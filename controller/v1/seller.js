const db = require('../../connection/pool').db;
var jwt = require('jwt-decode');
require('dotenv').config();
const format = require('pg-format');


const createCatalog = async (req,res) => {
    var decoded = jwt(req.headers.authorization.split(' ')[1]);
    const {name,description,products} = req.body;

    
    //using transaction begin,commit for inserting multiple rows in multiple tables so that either all will be inserted or no rows will be entered
    db.connect((err, client, done) => {
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
          const queryText = 'insert into tbl_catalog(user_id,name,description) values($1,$2,$3) returning id'
          client.query(queryText, [decoded.user_id,name,description], (err, result) => {
            if (err.code=23505) return res.status(200).json({status : 1, msg : 'Catalog already exists, Please edit'})

            if (err ) return shouldAbort(err);
            let values=[];
            products.forEach((p)=>{
                values.push([result.rows[0].id,p.name,p.description])
            })
            let queryProducts=format('INSERT INTO tbl_products (catalog_id, name, description) VALUES %L',values);
            client.query(queryProducts, [], (err, reslt) => {
              if (err ) return shouldAbort(err);
              client.query('COMMIT', err => {
                if (err) {
                  console.error('Error committing transaction', err.stack)
                  return res.status(500).json('something went wrong with db store')
                }
                done();
                res.status(201).json({'catalog_id':result.rows[0].id})
              })
            })
          })
        })
      })

}

const getOrders= async (req,res) => {
    var decoded = jwt(req.headers.authorization.split(' ')[1]);
    const {useremail, password} = req.body;

    db.query('select o.*, json_agg(p.*) as products from tbl_orders o join tbl_order_list l on o.id = l.order_id join tbl_products p on p.id=l.product_id  where o.seller_id=$1 group by o.id',[decoded.user_id],(error,reslt) => {
        if(error){
            return res.status(500).json('something went wrong with db store')
        }
        // console.log(reslt.rows[0])
        return res.status(200).json({orders:reslt.rows})
        
    })
}

module.exports = {
    createCatalog,
    getOrders
}