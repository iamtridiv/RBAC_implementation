const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');



passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => { //done is a callback function which takes four parameters
        try {
            const user = await User.findOne( { email });

            //username/email doest not exist 
            if(!user) {
                return done(null, false, {message: "Email is not registered!"})
            }

            // Email exist and now we need to verify the password
            const isMatch = await user.isValidPassword(password);
            if(isMatch) {
                return done(null, user)
            } else {
                return done(null, false, {message: "Incorrect password!"})
            }
        } catch (error) {
            done(error)
        }
    })
);



//sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });