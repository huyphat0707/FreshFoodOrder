var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);
var randomString = require('randomstring');
var nodemailer = require('nodemailer');
var Users = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

require('dotenv').config();

router.get('/userProfile', function (req, res, next) {
    var user = req.user;
    Order.find({
        user
    }, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.convertArray();
        });
        res.render('user/profile', {
            orders: orders,
            user: req.user,
            session: req.session
        });
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    req.session.user = null;
    req.flash('success_msg', 'Bạn đã đăng xuất');
    req
        .session
        .destroy();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/registration', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/registration', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        user: req.user
    });
});

router.post('/registration', passport.authenticate('local-registration', {
    successReturnToOrRedirect: '/verify-email',
    failureRedirect: '/user/registration',
    failureFlash: true
}));

router.get('/login', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/login', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        user: req.user
    });
});
router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/user/login',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect(oldUrl);
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
