var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cate = require('../models/cate');


/* GET home page. */
router.get('/', function (req, res, next) {
    let perPage = 8; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
  
    Product
      .find()
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.countDocuments((err, count) => { 
          if (err) return next(err);
           res.render('shop/index',  {
            products: products, 
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });

});

//category
router.get('/cate/:name.:id', function (req, res) {
    Cate.find(req.params.id, function (err, cate) {
        Product.find().then(function (data) {
            res.render('shop/product', { cate: cate, product: data });
        });
    });
});
//trang category
router.get('/product', function (req, res) {
    Product.find().then(function (product) {
        Cate.find().then(function (cate) {
            res.render('shop/product', { product: product, cate: cate });
        });
    });
});

//trang chi tiết sp
router.get('/detail/:id', function (req, res) {
    Product.findById(req.params.id).then(function (data) {
        res.render('shop/detail', { products: data });
    });
});

// tìm sản phẩm chi tiết
router.post('/detail/:id', function (req, res) {
    var find = req.body.find;
    Cate.find().then(function (cate) {
        Product.find({ title: { $regex: find } }, function (err, result) {
            res.render('shop/product', { product: result, cate: cate });
        });
    });
});

// add product to cart
router.get('/cart/:id', function (req, res, next) {
    Product.findOne(req.params.id, function(err){
        console.log(req.params.id);
    })
    // var prodId = req.params.productId;
    // var cart = new Cart(req.session.cart ? req.session.cart : {});  
    // Product.findById(req.params.id, function (err, product) {
    //     if (err) {
    //         return res.redirect("back");
    //       }
    //       cart.add(product, prodId);
    //       req.session.cart = cart;
    //       if (req.user) {
    //         req.user.cart = cart;
    //         req.user.save();
    //       }
    //       res.redirect("back");
    // });
});
router.get('/cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    console.log(cart);
    res.render('shop/cart', { products: cart.convertArray(), money: cart.money });

});

module.exports = router;
