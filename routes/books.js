const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Book Model
let Book = require('../models/book')

// User Model
let User = require('../models/user')

//Add Book Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add', {
        title: 'Add book'
    });
});

//Add Submit POST Route
router.post(
    '/add',
    body('title').not().isEmpty(),
    body('author').not().isEmpty(),
    body('body').not().isEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('add', {
                title: 'Add book',
                errors: errors
            })
        } else {
            let book = new Book();
            book.title = req.body.title;
            book.author = req.body.author;
            book.creator = req.user._id;
            book.body = req.body.body;
            book.isBorrowed = false;
            book.borrowedBy = "";
            book.save((err) => {
                if (err) {
                    console.log(err)
                } else {
                    req.flash('success', 'Book added')
                    res.redirect('/');
                }
            })
        }
    })

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (req.user.admin !== true) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
        res.render('edit', {
            title: "Edit Book",
            book: book
        });
    })
})

//Update Submit POST Route
router.post('/edit/:id', (req, res) => {
    let book = {};
    book.title = req.body.title;
    book.author = req.body.author;
    book.body = req.body.body;
    let query = { _id: req.params.id }
    Book.updateOne(query, book, (err) => {
        if (err) {
            console.log(err)
        } else {
            req.flash('success', 'Book updated')
            res.redirect('/');
        }
    })
})

//Borrow Book
router.post('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = { _id: req.params.id }
    let update = {
        isBorrowed: true,
        borrowedBy: req.user._id
    };
    Book.findById(req.params.id, (err, book) => {
        Book.updateOne(query, update, (err) => {
            if (err) {
                console.log(err)
            }
            res.send('Success');
        })
    })
})

//Return Book
router.put('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = { _id: req.params.id }
    let update = {
        isBorrowed: false,
        borrowedBy: ""
    };
    Book.findById(req.params.id, (err, book) => {
        Book.updateOne(query, update, (err) => {
            if (err) {
                console.log(err)
            }
            res.send('Success');
        })
    })
})

//Delete Book
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = { _id: req.params.id }
    Book.findById(req.params.id, (err, book) => {
        if (req.user.admin !== true) {
            res.status(500).send();
        } else {
            Book.deleteOne(query, (err) => {
                if (err) {
                    console.log(err)
                }
                res.send('Success');
            })
        }
    })
})

//Get Single Book
router.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    const user = book.author;
    if (user) {
        res.render('book', {
            book: book,
            creator: user
        });
    }
});

//Access control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('danger', 'Please login')
        res.redirect('/users/login')
    }
}

module.exports = router;