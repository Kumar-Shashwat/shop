const Product = require('../models/product');
const product_per_page = 8;


exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
            title : 'edit-product',
            path : 'admin/edit-product',
            editing : false,
            errorMessage : null,
            product : {
                title : 'Babbage',
                price : '200',
                author : 'annonymus',
                description : 'A great book to understand the things.',
            }

            // autharized : req.session.isLoggedIn,
            // csrfToken: req.csrfToken(),
        });
};

exports.postAddProduct = (req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const author = req.body.author;
    const description = req.body.description;
    const createrEmail = req.session.user.email;

    
    if(!image){

        // res.flash('error', 'Invalid input specially file.');
        return res.render( 'admin/edit-product',{
            title : 'edit-product',
            path : 'admin/edit-product',
            editing : false,
            errorMessage : 'Invalid image file. Please upload a image',
            product : {

                // to retain the user input in case of missing image.
                title : title,
                price : price,
                author : author,
                description : description,
            }

        })
    }
    // console.log(title, imageUrl);
    const imageUrl = image.path;
    
    const product = new Product(title, price, imageUrl, author, description, createrEmail);
    product.save().then(() => {
        res.redirect('/product-list');

    }).catch(err => {
        // will update some stuffs from the docments of the video.
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
};


exports.editProduct = (req, res, next) => {

    const productId = req.params.productId;
    const editMode = req.query.edit;

    if(editMode === false)
        res.redirect('/');

    Product.findById(productId).then(([rows, dataField]) => {
        res.render('admin/edit-product', {
            title :  'updating ' + rows[0].title,
            path : 'admin/edit-product',
            product: rows[0], 
            editing : editMode,
            // autharized : req.session.isLoggedIn,
            // csrfToken: req.csrfToken(),
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

    // console.log(product);

       
}

exports.postEditProduct = (req, res, next) =>{
    // console.log("your are in the post edit-product");
    
    // find product by id.
    const productId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const author = req.body.author;
    const description = req.body.description;

    let imageUrl = req.body.olderImageUrl;

    const email = req.session.user.email;

    if(image){
         imageUrl = image.path;
          // in this i do need to delete my older image from the image folder.
    }
    else{

            req.flash('error', 'Image is not uploaded or Attached file is not image.');
    }
       


    Product.updateAll(productId, title, price, imageUrl, author, description, email )
    .then( () => {
        req.flash('sucess', 'Product updated Sucessfully')
        res.redirect('/admin/products') // redirected to produts page of admin.
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}


exports.deleteProduct = (req, res, next) => {

    const productId = req.params.productId;
    const email = req.session.user.email;

    Product.deleteById(productId, email).then( () => {
        
        res.redirect('/admin/products') // redirected to produts page of admin.

        // res.status(200).json({ message: 'Success!' });

    }).catch(err => {

        // res.status(500).json({ message: 'Deleting product failed.' });
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.adminProducts = (req, res, next) => {

    const email = req.session.user.email;
    

    let message = req.flash('error');
    message = (message.length > 0)? message[0] : null;

    let sucessMessage = req.flash('sucess');
    sucessMessage = (sucessMessage.length > 0 ? sucessMessage[0] : null);

    const page = +req.query.page || 1;  // '+' sign indicates the the value is number 
    let totalProductsCount ;            // undefined || 1 === 1;

    Product.countProductsByEmail(email).then( ([totalProducts, fieldData]) => {

        totalProductsCount = totalProducts[0].count  ; 
        return Product.fetchProductsByEmail(email, (page-1)*product_per_page , product_per_page);

    })
    .then( ([rows, fieldData]) => {
        res.render('admin/products', {
            title : 'admin-products' , 
            prod : rows, 
            path : 'admin/products',

            errorMessage : message,
            sucessMessage : sucessMessage,

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
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}