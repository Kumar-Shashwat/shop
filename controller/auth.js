const crypto = require('crypto');

const User = require('../models/user');
const Token = require('../models/token');

const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { error } = require('console');


// "Brevo" is the third party mailSender application used.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.getLogin = (req, res, next) => {

    const isLoggedIn = req.session.isLoggedIn;
    if(isLoggedIn)
    {
        console.log('user is already loggedin');
        return res.redirect('/');
    }

    let message = req.flash('error');
    message = (message.length > 0)? message[0] : null;

    let sucessMessage = req.flash('sucess');
    sucessMessage = (sucessMessage.length > 0 ? sucessMessage[0] : null);

    res.render('auth/login.pug',{
        title : 'login',
        path : '/login',
        errorMessage : message,
        sucessMessage : sucessMessage,
        user : {
            email : '',
            password : '',
        }
        // csrfToken : req.csrfToken(),
    });
};

exports.postLogin = (req, res, next ) => {
    // req.isLogin = "true";
    // res.setHeader('Set-Cookie', 'isLogin = true');

    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email)
    .then(([rows, fieldData]) => {

        
        if(rows.length === 0){

            return res.render('auth/login.pug',{
                
                title : 'login',
                path : '/login',
                errorMessage : 'No user is registered with this email.',
                sucessMessage : null,
                user : {
                    email : email,
                    password : password,
                }
                // csrfToken : req.csrfToken(),
            });
        }
        const user = rows[0];
        
        bcryptjs.compare(password, user.password ).then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save( (err) => {
                    // console.log(err);
                    res.redirect('/');
                });  // redirect is faster than req.session.anyMethod(). To overcome this issue this save method is used.
            }
            else{
                
                res.render('auth/login.pug',{
                
                    title : 'login',
                    path : '/login',
                    errorMessage : 'Incorrect password.',
                    sucessMessage : null,
                    user : {
                        email : email,
                        password : password,
                    }
                });
            }
            

        }).catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
        
    }).catch( (err) => {
        console.log(err);

        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy( (err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getRegister = (req, res, next) => {


    const isLoggedIn = req.session.isLoggedIn;
    if(isLoggedIn)
    {
        console.log('user is already loggedin');
        return res.redirect('/');
    }

    let message = req.flash('error');
    message = (message.length > 0)? message[0] : null;

    res.render('auth/register.pug', {
        title: 'register' , 
        path : '/register',
        errorMessage : message,
        user : {
            name : '',
            email : '', 
            password : '',
            confirmPassword : '', 
        }
        // csrfToken: req.csrfToken(),
    });
};

exports.postRegister = (req, res, next ) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    // cheaking password.

    if(password !== confirmPassword){
        return res.render('auth/register' , {
            title: 'register' , 
            path : '/register',
            errorMessage : 'Password did not matched.',
            user : {
                name : name,
                email : email,
                password : password,
                confirmPassword : confirmPassword, 
            }
        })
    }

    // only unique email address can be inserted into databases.

    // insert the email and password to the user table by encrypting the passowd.

    bcryptjs.hash(password, 12).then((hashedPassword) => { // bcryptjs return a promise
        //console.log(hashedPassword);                     // hashed passwods can to reverted to the original password.

        const user = new User(name, email, hashedPassword);

        user.save().then( () => {

            req.flash('sucess','Sucessfully registered! Enter your email and password to login.');
            res.redirect('/login');
            return transporter.sendMail({       // returns a promish.
                from: 'kumarshashwat20@gmail.com',
                to: email,
                subject: `Sucessfully registered`,
                html : '<h1> You have been secessfully registered to the shop.com</h1>',
            })
            .then(result => console.log(result))
            .catch( (err) => {

                console.log(err);
                // const error = new Error(err);
                // error.httpStatusCode = 500;
                // return next(error);
            });
        })
        .catch((err) => {
            
            // req.flash( 'error', );
            // instead of redirecting , render the '/register' page. with user inputs.
            // res.redirect('/register')

            res.render('auth/register' , {
                title: 'register' , 
                path : '/register',
                errorMessage : 'A user with this email is already registered.',
                user : {
                    name : name,
                    email : email,
                    password : password,
                    confirmPassword : confirmPassword, 
                }
            })
        });
    }).catch( (err) => {
        const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.verifyEmail = (req, res, next) => {

    let message = req.flash('error');
    message = (message.length > 0)? message[0] : null;

    res.render('auth/verify-email', {
        title : 'verify-email',
        path : '/auth/verify-email',
        errorMessage : message,
    })
}


exports.postVerifyEmail = (req, res, next) => {
    // console.log("in the post verify pasword controller. ")
    const email = req.body.email;

    User.findByEmail(email).then( ([rows, fieldData]) => {

        if(rows.length === 0){
            req.flash('error' , `This email "${email}" is not registered. First create an account .`);
            return res.redirect('/verify-email');
        }

        const user = rows[0];

        // create token.
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
            //   console.log(err);
              return res.redirect('/verify-email');
            }
            const token = buffer.toString('hex');

            // cheak if a token already present in the database for the current user.

            Token.findTokenByEmail(email).then( ([rows, fieldData]) => {
                if(rows.length === 0)
                    //insert token to data base of Token table.
                    return Token.insertToken(email, token, Date.now() + 3600000);   // insertToken return a promish so the next .then  block is executed.
                else
                    //update token number and expiration value in the data base correspoindin the user.
                    return Token.updateToken(email, token, Date.now() + 3600000);   // updateToken return a promish so the next .then  block is executed.
            })
            .then(result => {
                //send eamil to the user for reseting the passowrd.
                req.flash('sucess', 'Password reset link has been sent to your email. Please cheak your mail');
                res.redirect('/login');
                
                return transporter.sendMail({               // sendMail send a promise if no call back function is present.
                    from: 'kumarshashwat20@gmail.com',
                    to: email,
                    subject: `Reset Password`,
                    html : `<h1>Your password reset process has initiated.</h1>
                            <p><h3>click on 
                            <a href = "https://shop-l1yw.onrender.com/reset-password/${token}"> reset password </a> 
                            to change your password.</h3> </p>
                            <p> The pssword reset link expires afer one hour `,
                })
                .then(result => console.log(result)).catch( (err) => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
            })
            .catch( (err) => {

                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });

        })

    }).catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getResetPassword = (req, res, next) => {
    // console.log("hello");
    const token = req.params.token;
    
    // const tokenDetials = 
    Token.findTokenDetias(token).then(([tokenDetias,fieldData]) => {
        // extract sub-detis from tokendetials.

        if(tokenDetias.length ===0)
        {
            req.flash('error', 'You are unautharized to change the password.');
            return res.redirect('/login');
        }

        const email = tokenDetias[0].email;
        const expirationTime = tokenDetias[0].expirationTime;

        if(expirationTime < Date.now()){
            req.flash('error', `You'r timed out! to change the password.`);
            return res.redirect('/login');
        }

        res.render('auth/reset-password', {
            title: 'Change Password',
            email : email,
            token : token,
        })

    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    const newPassword = req.body.password;
    const token = req.body.token;
    
    User.findByEmail(email).then( ([rows,fieldData]) => {
        const user = rows[0];
        
        bcryptjs.hash(newPassword, 12).then(newPassword => {

            user.password = newPassword;

            User.updateDetails(user).then( () => {

                Token.removeToken(token); // token is not present here.
                req.flash('sucess', 'Password sucessfull updated!');
                res.redirect('/login');

                return transporter.sendMail({               // sendMail send a promise if no call back function is present.
                    from: 'kumarshashwat20@gmail.com',
                    to: email,
                    subject: ` Password changed sucessfully`,
                    html : `<h1>Your password has been changed sucessfully.</h1> `,
                }).then(() => {}).catch(err => console.log(err));

            }).catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });

        }).catch( (err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }).catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}