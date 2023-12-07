// const http = require('http');

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParsher = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const db = require('./util/database.js');

const sessionStore = new MySQLStore({}/* session store options */, db);



const app = express();

const csrfProtection = csrf();

app.set('view engine', 'pug');  // what to see
app.set('views', 'view');       // where to see the pug files.

const routerAdminData = require('./routes/admin.js');
const routerShop = require('./routes/shop.js');
const routerLogin = require('./routes/auth.js');
const routerError = require('./routes/error.js');
const routerCart = require('./routes/cart.js');
const { Timestamp } = require('mongodb');


const fileStorage = multer.diskStorage ({
  
  destination : (req, file, cb) => {
    cb(null, 'image' );
  },
  filename:  (req, file, cb) => {
    const  uniqueSuffix =  file.originalname + '-' + Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const fileFilter = (req, file, cb)  => {

  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null, true);
  }
  else
    cb(null, false);
}

const acessLogStream = fs.createWriteStream(path.join( __dirname, 'acess.log'), {flags : 'a'});

app.use(bodyParsher.urlencoded({extended: false}));
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    })
  );
app.use(csrfProtection);
app.use( (req, res, next ) => {              // in all the view we are rendering these two values will be automatically passed.
  res.locals.autharized = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})
app.use(flash());
app.use(helmet()); 
app.use(compression());
app.use(morgan('combined', {stream : acessLogStream}));



app.use('/admin', routerAdminData.router);
app.use(routerShop);
app.use(routerLogin);
app.use(routerCart);
app.use(routerError);

app.use((error , req, res, next) => {
  console.log(error);  

  res.status(505);
  res.render('error500', {title : 'error occured ', path: 'error500'});
})


// const server = http.createServer(app);

// server.listen(60000);    // no need to create server and listening.

// express had a method listen which auto matically create a server and listening to the given port.
// console.log(Date.now())   

const port = process.env.PORT ;
app.listen(port);      