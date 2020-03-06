const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secretOrKey = 'secret';

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, customProp: "test" }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
                // if successfully logged in create jwt token
                var token = createToken({ username: req.body.username });
                res.render('index', { user: req.user, token: token });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
        // from now on we'll identify the user by the username and the username is the only personalized value that goes into our token,
        // if successfully logged in create jwt token
        var token = createToken({ username: req.body.username });
        res.render('index', { user: req.user, token: token });
});

router.get('/logout', (req, res, next) => {
    // this should happen on frontend
});

router.get('/ping', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send("pong!");
});

function createToken(claimsObj){
    if(!!claimsObj) {
        return 'Bearer ' + jwt.sign(claimsObj, secretOrKey);
    }
}

module.exports = router;
