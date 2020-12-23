//importing dependdencies 
const express = require('express')
const createHttpError = require('http-errors')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const conncetFlash = require('connect-flash')


//initialization
const app = express()
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Init session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            //secure: true //use only when it is https server
            httpOnly: true
        }
    })
)

app.use(conncetFlash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});


//Routes
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));
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
