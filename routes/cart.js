var express = require('express');
var router = express.Router();

var Cart = require('../models/cart.js');
var order = require('../models/order.js');


router.get('/', isLoggedIn, function(req, res, next) {
  res.redirect('/admin/cart/list', {layout: false});
});

router.get('/list', isLoggedIn, function(req, res, next) {
	order.find().then(function(data){
	    res.render('admin/cart/list', {data: data, layout: false});
	});
  
});

router.get('/:id/view', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    order.findById(id).then(function(dl){
        res.render('admin/cart/view', {pro: dl ,layout: false });
   });
});

router.get('/:id/pay', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    order.findById(id, function(err, data){
        data.st = 1;
        data.save();
        req.flash('succsess_msg', 'Đã Thanh Toán');
       res.redirect('/admin/cart/'+id+'/view');
    });
});


router.get('/:id/delete', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    order.findOneAndRemove({_id: id}, function(err, offer){
        req.flash('succsess_msg', 'Đã Xoá Thành Công');
       res.redirect('/admin/cart/list'); 
    });
});

module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next){
    if(req.isAuthenticated() && req.user.roles === 'ADMIN' ){
      return next();
    } else
    res.redirect('/admin/login');
  };