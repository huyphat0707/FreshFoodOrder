var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cate = require('../models/cate');


/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find().limit(8).then(function (product) {
        res.render('shop/index', { products: product });
    });
});

// tìm sản phẩm index
router.post('/', function (req, res) {
    var find = req.body.find;
    console.find(find);
    Cate.find().then(function (cate) {
        Product.find({ title: { $regex: find } }, function (err, result) {
            res.render('shop/product', { product: result, cate: cate });
        });
    })
});

//category
router.get('/cate/:name.:id.html', function (req, res) {
    // var login  = req.session.user ? true : false
    Product.find({ cateId: req.params.id }, function (err, data) {
        Cate.find().then(function (cate) {
            res.render('shop/product', { product: data, cate: cate });
        });
    });
});

// tìm sản phẩm category
router.post('/cate/:name.:id.html', function (req, res) {
    var find = req.body.find;
    Cate.find().then(function (cate) {
        Product.find({ title: { $regex: find } }, function (err, result) {
            res.render('shop/product', { product: result, cate: cate });

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

// tìm sản phẩm category
router.post('/san-pham.html', function (req, res) {
    var find = req.body.find;
    Cate.find().then(function (cate) {
        Product.find({ title: { $regex: find } }, function (err, result) {
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    });
});

//trang chi tiết sp
router.get('/detail/:id', function (req, res) {
    Product.findById(req.params.id).then(function (data) {
        console.log(data);
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



//del 1 product
router.get('/remove/:id', function (req, res) {
    var productId = req.params.id;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.delCart(productId);
    req.session.cart = giohang;
    res.redirect('/gio-hang');
});

//del product
router.get('/delcart/:id', function (req, res) {
    var productId = req.params.id;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.remove(productId);
    req.session.cart = giohang;
    res.redirect('/gio-hang');
});

//update sp
router.post('/update/:id', function (req, res) {
    var productId = req.params.id;
    var sl = req.body.sl;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.updateCart(productId, sl);
    req.session.cart = giohang;
    var data = giohang.convertArray();
    res.render('shop/gio-hang', { products: data, Tien: giohang.Tien });
});


module.exports = router;
