const Cart = require('../models/cart');   

exports.getCart = (req, res, next) => {

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    let totalAmount = 0;
    Cart.cartAmount(user_id)
    .then( ([rows, fieldData]) => { // it fethes the total amount of products present in the cart of particular user.
         
        if(rows.length != 0)
            totalAmount = rows[0].user_cart_amount;

        return Cart.fetchCart(user_id);     // fetches all product present in the cart of paricular user.

    })
    .then(([rows, fieldData]) => {

        res.render('shop/cart', {
            title : 'cart',
            prod : rows,
            path : 'shop/cart',
            totalAmount : totalAmount,
            // autharized : req.session.isLoggedIn,
            // csrfToken: req.csrfToken(),
        });
        
    })
    .catch(err =>  {                    // if any of the then block trows an error then catch block will be executed.
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
        
};

exports.postCart = (req, res, next) =>{
    const prodId = req.body.prodId;
    // console.log(prodId);

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    Cart.addToCart(prodId, user_id);

    res.redirect('/product-list');

    // console.log(product.id, product.title, product.price, product.author);
    
};

exports.removeItem = (req, res, next ) => {
    const prodId = req.params.prodId;

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    Cart.removeItem(prodId, user_id).then(() => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
};

exports.decreaseCount = (req, res , next) => {

    const prodId = req.params.prodId;

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    Cart.decreaseCount(prodId, user_id).then(res.redirect('/cart')).catch(err => console.log(err));

}

exports.increaseCount = (req, res , next) => {

    const prodId = req.params.prodId;

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    Cart.increaseCount(prodId, user_id).then(res.redirect('/cart')).catch(err => console.log(err));
}

exports.cheakout = (req, res, next) => {

    const user_id = req.session.user.id; // some how we get the id of user. may be by sql command.

    let totalAmount = 0;
    Cart.cartAmount(user_id)
    .then( ([rows, fieldData]) => { // it fethes the total amount of products present in the cart of particular user.
         
        if(rows.length != 0)
            totalAmount = rows[0].user_cart_amount;

        return Cart.fetchCart(user_id);     // fetches all product present in the cart of paricular user.

    })
    .then(([rows, fieldData]) => {

        res.render('shop/cheakout', {
            title : 'cheakout',
            prod : rows,
            path : 'shop/cheakout',
            totalAmount : totalAmount,
            // autharized : req.session.isLoggedIn,
            // csrfToken: req.csrfToken(),
        });
        
    })
    .catch(err =>  {                    // if any of the then block trows an error then catch block will be executed.
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};