
const db = require('../util/database');

module.exports = class Product{

    constructor(title, price, imageUrl, author , description, createrEmail){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.author = author;
        this.description = description;
        this.createrEmail = createrEmail;
    }

    save() {

        return db.execute('insert into  products (title, price, imageURL, author, description, createrEmail  ) values ( ?, ?, ?, ?, ?, ? )',
            [this.title, this.price, this.imageUrl, this.author, this.description, this.createrEmail] 
        );

        // this.id = Math.random().toString();
        // products.push(this);
    }

    static fetchAll(from, size){    
        

        return db.execute (`SELECT 
                                *
                            FROM
                                products
                            ORDER BY id DESC
                            LIMIT ?, ?;`, [from.toString(), size.toString()]
                            );
        
        // return products;  
    }

    static fetchProductsByEmail(email, from , size){
        return db.execute('SELECT * FROM products WHERE createrEmail = ? ORDER BY id DESC LIMIT ?, ?', [email, from.toString(), size.toString()]);
    }

    static findById(id){

        return db.execute('SELECT * FROM products WHERE id = ?', [id]) ;

        // for(let x of products){
        //     if(x.id ===  id)
        //     {
        //         return x;
        //     }
        // }
    }

    static getImageUrl (id, email ){
        return db.execute(`SELECT imageUrl FROM products where id = ? and createrEmail = ?;`, [id, email]); 
    }

    static deleteById(id, email){

        return db.execute(`DELETE FROM products WHERE id =  ? and createrEmail = ? ;`, [id, email]);

        // for(let i =0; i< products.length; i++){
        //     if(products[i].id ===  id)
        //     {
        //         products.splice(i,1);
        //         break;
        //     }
        // }
    }

    static updateAll(id, title, price, imageUrl, author, description , createrEmail){
        return db.execute('UPDATE products set title = ?, price = ?, imageUrl = ?, author = ?, description = ? where id = ? AND createrEmail = ?;',
            [title, price, imageUrl, author, description, id, createrEmail]
        )
    };
 
    static countProducts (){
        return db.execute('select count(*) as count from products ;');
    }


    static countProductsByEmail (email){
        return db.execute('select count(*) as count from products where createrEmail = ? ;', [email]);
    }
};