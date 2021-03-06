const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./config/database')
const passport = require('passport');

mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Connected to MongoDB')
})

//Check for db errors
db.on('error', (err) => {
    console.log(err)
})

//Init application
const app = express();

//Bring in Models
let Book = require('./models/book')

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Express Session Middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

//Home Route
app.get('/', (req, res) => {
    Book.find({}, (err, books) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'Hello',
                books: books
            });
        }
    })
});

//Route Files
let books = require('./routes/books');
let users = require('./routes/users');
const { maxHeaderSize } = require('http');
app.use('/books', books);
app.use('/users', users);

//Route 404
app.use((req, res) => {
    res.redirect("/");
});

//Start Server
app.listen(3000, () => {
    console.log('Server started on port 3000')
});