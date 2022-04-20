const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { User } = require('../models/user');
const passport = require('passport')


// Register Form
router.get('/register', (req, res) => {
    res.render('register')
})

//Register Proccess
router.post(
    '/register',
    body('name').not().isEmpty().withMessage('Cannot be empty'),
    body('email').isEmail().normalizeEmail().withMessage('Cannot be empty'),
    body('username').not().isEmpty().withMessage('Cannot be empty'),
    body('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    }),
    (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;
        let isAdmin = req.body.isAdmin;
        if (isAdmin == "on") { isAdmin = true };
        if (isAdmin == "off") { isAdmin = false };
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('danger', 'Please fill in every field')
            return res.redirect('/users/register');
        } else {
            let newUser = new User({
                name: name,
                email: email,
                password: password,
                username: username,
                admin: isAdmin
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err)
                    }
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err)
                            return
                        } else {
                            req.flash('success', 'You are now registered and can log in')
                            res.redirect('/users/login')
                        }
                    })
                })
            });
        }
    })

//Login Form
router.get('/login', (req, res) => {
    res.render('login')
})

//Login Process
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login')
})

module.exports = router;