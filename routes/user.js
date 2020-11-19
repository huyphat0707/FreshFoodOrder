var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);
var Order = require('../models/order');
var Cart = require('../models/cart');

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  req.session.user = null;
  req.flash('success_msg', 'Bạn đã đăng xuất');
  req.session.destroy(); //xóa
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
  });
});

router.post(
  '/registration',
  passport.authenticate('local-registration', {
    failureRedirect: '/user/registration',
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(req.session.oldUrl);
    } else {
      res.redirect(oldUrl);
    }
  }
);
// router.post('/registration', passport.authenticate('local.registration',{
//   successRedirect:'/user/registration',
//   failureRedirect: '/user/registration',
//   failureFlash: true
// }));

router.get('/userProfile', function (req, res, next) {
  Order.find({user: req.user}, function (err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.convertArray();
    });
    res.render('user/profile', {orders: orders});
  });
});

router.get('/login', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});
router.post(
  '/login',
  passport.authenticate('local-login', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      res.redirect(req.session.oldUrl);
      req.session.oldUrl = null;
    } else {
      res.redirect(oldUrl);
    }
  }
);
// router.post('/login', passport.authenticate('local-login',{
//     successRedirect:'/',
//     failureRedirect: '/user/login',
//     failureFlash: true
//   }));

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
