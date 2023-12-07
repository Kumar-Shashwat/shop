const db = require('../util/database');

module.exports = class Cart{
        // some operatoins on cart table.
        static fetchCart(user_id){
            return db.execute('select p.*, c.count from (SELECT product_id, count FROM cart  where user_id = ?) c inner join products p on c.product_id = p.id;',
                [user_id]
            );
        }
    
        static addToCart(prodId, user_id){
    
            db.execute('SELECT product_id FROM cart WHERE user_id = ?;',[user_id]).then( ([rows, fieldData]) => {
                
                let i ;
                for( i = 0; i< rows.length; i++){
    
                    if(rows[i].product_id === parseInt(prodId))
                    {   
                        return db.execute('update cart set count = count + 1 where product_id = ? AND user_id = ?;',[prodId, user_id]);
                    }
                }
                if(i === rows.length){
                    return db.execute('INSERT INTO cart (product_id, user_id, count) VALUES  (?, ?, ?);', [prodId, user_id, 1]);
                }
            }).catch(err => console.log(err));
        }
    
        static removeItem(prodId, user_id){
    
            return db.execute('DELETE FROM cart WHERE product_id = ? AND user_id = ?;', [prodId, user_id]);
        }
    
        static decreaseCount(prodId, user_id){
            return db.execute('UPDATE cart SET count = count - 1 WHERE product_id = ? AND user_id = ?;',[prodId, user_id]);
        }
    
        static increaseCount(prodId,  user_id){
            return db.execute('UPDATE cart SET count = count + 1 WHERE product_id = ? AND user_id = ?;',[prodId, user_id]);
        }

        static cartAmount (user_id){
            return db.execute(`with final as (
                select  cart.*, products.createrEmail, cart.count*products.price  amount  from cart join products on cart.product_id = products.id where cart.user_id = ?
                
                ) select   sum(amount) user_cart_amount,  final.createrEmail, final.user_id from final group by final.createrEmail, final.user_id;`, [user_id]);
        }
}