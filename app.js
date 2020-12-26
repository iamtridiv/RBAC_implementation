//importing dependdencies 
const express = require('express')
const createHttpError = require('http-errors')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const conncetFlash = require('connect-flash')
const passport = require('passport')
const connectMongo = require('connect-mongo')
const connectEnsureLogin = require('connect-ensure-login')
const { roles } = require('./utils/constants')


//initialization
const app = express()
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Session store
const MongoStore = connectMongo(session)
//Init session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            //secure: true //use only when it is https server
            httpOnly: true
        },
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    })
);
// For passport js authentication 
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');


app.use((req ,res, next) => {
    res.locals.user = req.user;
    next();
})


// Connect flash
app.use(conncetFlash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});


//Routes
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", connectEnsureLogin.ensureLoggedIn({redirectTo: '/auth/login'}), require("./routes/user.route"));
app.use("/admin", connectEnsureLogin.ensureLoggedIn({redirectTo: '/auth/login'}), ensureAdmin, require("./routes/admin.routes"));
app.use((req, res, next) => {
    next(createHttpError.NotFound())
});


//error handling 
app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x', {error})
    //res.send(error);

})

//port initialization
const PORT = process.env.PORT || 3000

//databse connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    //if database is connected then open the port 3000
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    console.log("Database connected...")
}).catch(err => console.log(err.message));

// protect routes
/*function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}*/

function ensureAdmin(req, res, next) {
    if(req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'You are not authorized to see this route!');
        res.redirect("/");
    }
}
