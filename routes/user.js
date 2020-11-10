var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
const user = require('../models/user');
var csrfProtec = csrf();
router.use(csrfProtec);


router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  req.session.user = null;
  req.flash('succsess_msg', 'Bạn đã đăng xuất');
  req.session.destroy();  //xóa
  res.redirect('/');
});

router.use('/', notisLoggedIn, function(req, res, next){
  next();
});

router.get('/registration', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/registration', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/registration', passport.authenticate('local.registration',{
  successRedirect: '/user/registration',
  failureRedirect: '/user/registration',
  failureFlash: true
}));


router.get('/login', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/login', passport.authenticate('local.login',{
  successRedirect: '/admin',
  failureRedirect: '/user/login',
  failureFlash: true
}));
router.get('/edit',isLoggedIn, function(req, res, next){
        res.render('user/edit');
});
;
router.post('/:id/edit', isLoggedIn, function(req, res){
  res.render('user/edit');
});
module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notisLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}