// Importing all packages
const { render } = require("ejs");
const User = require("../models/user.model");
const router = require("express").Router()
const { body, validationResult} = require('express-validator')
const passport = require('passport')
const connectEnsure = require('connect-ensure-login')


//get route for login page
router.get("/login", connectEnsure.ensureLoggedOut({redirectTo: '/'}), async (req, res, next) => {
    //res.send("Login");
    res.render('login');
});

//post route for login page 
router.post("/login", connectEnsure.ensureLoggedOut({redirectTo: '/user/profile'}), passport.authenticate('local', {
    //successRedirect: "/",
    successReturnToOrRedirect: '/',
    //successReturnToOrRedirect: '/',
    failureRedirect: "/auth/login",
    failureFlash: true
}));


//get route for register page 
router.get("/register", connectEnsure.ensureLoggedOut({redirectTo: '/'}), async (req, res, next) => {
    //res.send("Register");
    //req.flash('Email already exists', 'error');
    //const messages = req.flash();
    res.render('register');
});

//post route for register page
router.post("/register", connectEnsure.ensureLoggedOut({redirectTo: '/'}),
 [
    body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email')
    .normalizeEmail()
    .toLowerCase(),

    body('password')
    .trim()
    .isLength(4)
    .withMessage('Minimum length of the password should be 4'),

    body('password2').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password do not match')
        }
        return true;
    })
], async (req, res, next) => {
    //res.send("Register post");
    //res.send(req.body);
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
           errors.array().forEach(error => {
               req.flash('error', error.msg);
           })
           res.render('register', {email: req.body.email, messages: req.flash()})
           return;
        }
        const { email } = req.body;
        const doesExist = await User.findOne({ email });
        if (doesExist) {
            res.redirect('/auth/register');
            return;
        }
        const user = new User(req.body);
        await user.save();

        req.flash('success', `${user.email} registered successfully`)
        res.redirect('/auth/login');
        res.send(user);
    } catch (error) {
        next(error);//error handle at app.js
    }
});


router.get("/logout", connectEnsure.ensureLoggedIn({redirectTo: '/'}), async (req, res, next) => {
    req.logout();//comes from passport package
    res.redirect('/');//after successfully logout redirect to homepage 
})
module.exports = router;

/*function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

function ensureNOTAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('back');
    } else {
        next();
    }
}*/