var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var randomString = require("randomstring");
var nodemailer = require('nodemailer');
var User = require('../models/user');

require('dotenv').config();

router.get('/', isLoggedIn, function (req, res) {
  res.render('admin/main/index', { layout: false });
});
router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/admin/login');
});

router.get('/login', notisLoggedIn, function (req, res, next) {
  var messages = req.flash('error');
  res.render('admin/login/login_ad', {
    messages: messages, hasErrors: messages.length > 0,
    layout: false
  });
});

router.get('/changePass', function (req, res, next) {
  const messages = req.flash("error");
  res.render('admin/login/changePassword', { layout: false, messages:messages, hasErrors:messages.length>0 });
})
router.post('/changePass', function (req, res, next) {
  bcrypt.compare(req.body.oldPass, req.user.password, function (err, result) {
    if (!result) {
      req.flash("error", "Mật khẩu cũ không đúng!");
      return res.redirect("back");
    } else if (req.body.newPass != req.body.newPass2) {
      req.flash("error", "Nhập lại mật khẩu không khớp!");
      return res.redirect("back");
    } else {
      req.user.password = bcrypt.hashSync(req.body.newPass);
      req.user.save();
      req.flash("error", "Đổi mật khẩu thành công!");
      res.render("admin/login/login_ad", { layout: false });
    }
  });
})
router.get('/forgotPassword', function (req, res, next) {
  const messages = req.flash("error");
  res.render('admin/login/forgotPassword',
    {
      layout: false,
      user: req.user,
      messages: messages,
      hasErrors: messages.length > 0,
    });
});
router.post('/forgotPassword', function (req, res, next) {
  const email = req.body.email;
  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      req.flash("error", "Email không tồn tại!");
      return res.redirect("/admin/forgotPassword");
    } else {
      //nodemailer
      // SMTP (Simple Mail Transfer Protocol,giao thức truyền tải thư tín đơn giản hóa)
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
   });
      var pass = randomString.generate({
        length: 6
      });
      var mainOptions = {
        from: 'hahuy0707@gmail.com',
        to: email,
        subject: "Test",
        html: "<p>Mật khẩu mới của bạn là:</p>" + pass
      };
      transporter.sendMail(mainOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Sent:" + info.response);
          }
        });
      // req.user.password = bcrypt.hashSync(req.body.newPass);
      // req.user.save();
      // req.flash("messages", "Đổi mật khẩu thành công!");
      // res.render("admin/login/login_ad", { layout: false });
    }
  });
})


router.post('/login', passport.authenticate('local.login_ad', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login',
  failureFlash: true
}));


module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.roles === 1) {
    return next();
  } else
    res.redirect('/');
};

function notisLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    if (req.isAuthenticated() && req.user.roles !== 1) {
      return next();
    } else {
      res.redirect('/admin');
    }
  }
};
