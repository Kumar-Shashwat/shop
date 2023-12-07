const Product = require('../models/product');
const product_per_page = 8;

exports.index = (req, res, next) => {

    
    // const page = (req.query.page) ? parseInt(req.query.page) : 1; 
    const page = +req.query.page || 1;
    // console.log(req.query.page ,typeof(`${page}`), typeof(page), page);

    let totalProductsCount ;

    
    Product.countProducts().then( ([totalProducts, fieldData]) => {
        
        totalProductsCount = totalProducts[0].count  ; 

        return Product.fetchAll(  (page-1)*product_per_page , product_per_page )
    }) 
    .then(([rows, fieldData]) => {

        // console.log(Math.ceil(totalProductsCount/product_per_page));
        // console.log(typeof(page)); 

        res.render('shop/index', {
            title : 'shop',
            prod : rows, 
            path : 'shop/index',

            // about eror and sucess message.
            errorMessage : null,
            sucessMessage : null,
            
            // about pagination
            hasPreviousPage : page > 1,
            previousPage : page -1,

            currPage : page,

            hasNextpage : totalProductsCount > page*product_per_page,
            nextPage : page + 1,

            lastPage : Math.ceil(totalProductsCount/product_per_page),

            // autharized : req.session.isLoggedIn, 
            // csrfToken: req.csrfToken(),
         });
        //  console.log("idx shop controller :" , req.session.isLoggedIn);
    }).catch(err => {
        console.log(err);
    });
}

exports.shopGallery = (req, res , next) => {
    // console.log("In the last middleware!");
    // res.sendFile(path.join(__dirname, '../', 'view', 'shop.html'));

    const page = +(req.query.page) || 1; 
    // console.log(req.query.page ,typeof(`${page}`), typeof(page), page);

    let totalProductsCount ;

    Product.countProducts().then( ([totalProductsArray, fieldData]) => {
        
        totalProductsCount = totalProductsArray[0].count  ; 

        return Product.fetchAll(  (page-1)*product_per_page , product_per_page )
    }) 
    .then(([rows, fieldData]) => {

        // console.log(Math.ceil(totalProductsCount/product_per_page));
        // console.log(typeof(page)); 

        res.render('shop/product-list', {
            title : 'shop',
            prod : rows, 
            path : '/shop/product-list',

            // about eror and sucess message.
            errorMessage : null,
            sucessMessage : null,
            
            // about pagination
            hasPreviousPage : page > 1,
            previousPage : page -1,

            currPage : page,

            hasNextpage : totalProductsCount > page*product_per_page,
            nextPage : page + 1,

            lastPage : Math.ceil(totalProductsCount/product_per_page),

            // autharized : req.session.isLoggedIn, 
            // csrfToken: req.csrfToken(),
         });
        //  console.log("idx shop controller :" , req.session.isLoggedIn);
    }).catch(err => {
        console.log(err);
    });

    
    // console.log(Product.fetchAll());
};


exports.productDetials = (req, res, next) => {
    const prodId = req.params.prodId;
    // console.log(prodId);

    Product.findById(prodId).then( ([rows, fieldData]) => {
        res.render('shop/product-details', {
            title :'Details of '+ rows[0].title ,
            product : rows[0], 
            path : 'shop/product-details',
            // autharized: req.session.isLoggedIn,
            // csrfToken: req.csrfToken(),
        });
    }).catch(err => console.log(err));
};