var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cate = require('../models/cate');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  var perPage = 8;
  var page = parseInt(req.query.page) || 1;
  var SORT_ITEM;
  var sort_value = 'Giá từ thấp tới cao';
  var price;
  SORT_ITEM = req.query.orderby;
  if (SORT_ITEM == -1) {
    sort_value = 'Giá từ cao tới thấp';
    price = '-1';
  }
  if (SORT_ITEM == 1) {
    sort_value = 'Giá từ thấp tới cao';
    price = '1';
  }
  Product.find({})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({price})
    .exec(function (err, products) {
      Product.countDocuments().exec(function (err, count) {
        if (err) return next(err);
        res.render('shop/index', {
          products: products,
          current: page,
          hasNextPage: perPage * page < count,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          pages: Math.ceil(count / perPage),
          successMsg: successMsg,
          noMessages: !successMsg,
          sort_value: sort_value,
          perPage: perPage,
          session: req.session,
          user: req.user,
        });
      });
    });
});
router.post('/?', (req, res, next) => {
  perPage = parseInt(req.body.numItems);
  res.redirect('back');
});

//trang category
router.get('/product', function (req, res) {
  Product.find().then(function (product) {
    Cate.find().then(function (cate) {
      res.render('shop/product', {
        product: product,
        cate: cate,
        session: req.session,
      });
    });
  });
});

//trang chi tiết sp
router.get('/detail/:id', function (req, res) {
  Product.findById(req.params.id).then(function (data) {
    res.render('shop/detail', {products: data, session: req.session});
  });
});

//find
router.post('/', function (req, res) {
  var find = req.body.findPro;
  Cate.find().then(function (cate) {
    Product.find({Name: {$regex: find}}, function (err, result) {
      res.render('shop/product', {product: result, cate: cate});
    });
  });
});

router.post('/product', function (req, res) {
  var find = req.body.findPro;
  Cate.find().then(function (cate) {
    Product.find({Name: {$regex: find}}, function (err, result) {
      res.render('shop/product', {product: result, cate: cate});
    });
  });
});

router.post('/detail/:id', function (req, res) {
  var find = req.body.findPro;
  Cate.find().then(function (cate) {
    Product.find({Name: {$regex: find}}, function (err, result) {
      res.render('shop/product', {product: result, cate: cate});
    });
  });
});
// add product to cart
router.get('/addToCart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/cart');
  });
});

router.get('/cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart', {
    products: cart.convertArray(),
    totalPrice: cart.totalPrice,
    user: req.user,
    session: req.session,
  });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/checkout', {products: null});
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    products: cart.convertArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty,
    errMsg: errMsg,
    noError: !errMsg,
    user: req.user,
    session: req.session,
  });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/checkout', {products: null});
  }
  var cart = new Cart(req.session.cart);
  const Stripe = require('stripe');
  const stripe = Stripe(
    'sk_test_51HmsPSC7JsqB6DBPXkeiqfMqMcYABVSeUWEcwNkU7yAeUB0CGO6gD0nkHRRp8zCHyFmfqmpcDbEJt08mL3hKxnEt00StkPeHyO'
  );
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken, // obtained with Stripe.js
      description: 'Payment charge',
    },
    function (err, charge) {
      // asynchronously called
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        paymentId: charge.id,
      });
      order.save(function (err, result) {
        req.flash('success', 'Successful bought product!');
        req.session.cart = null;
        user = req.user;
        res.redirect('/user/profile');
      });
    }
  );
});

//del 1 product
router.get('/delCart/:id', function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.delCart(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

//del all
router.get('/remove/:id', function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

//update sp
router.post('/update/:id', function (req, res) {
  var productId = req.params.id;
  var qty = req.body.qty;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.updateCart(productId, qty);
  req.session.cart = cart;
  var data = cart.convertArray();
  res.render('shop/cart', {
    products: data,
    totalPrice: cart.totalPrice,
    session: req.session,
  });
});

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/login');
}
