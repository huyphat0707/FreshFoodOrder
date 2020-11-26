var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Cate = require('../models/cate.js');
const uploadImage = require('../config/multer.js');

// router.get('/', isLoggedIn, function (req, res) {
//   res.redirect('/admin/product/List', {layout: false});
// });

router.get('/add', isLoggedIn, (req, res) => {
  Cate.find().then(function (cate) {
    res.render('admin/product/Add', {
      errors: null,
      cate: cate,
      layout: false,
      user: req.user,
    });
  });
});
router.post('/add', isLoggedIn, uploadImage.single('image'), function (
  req,
  res,
  next
) {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  } else {
    var pro = new Product({
      CateId: req.body.category,
      Name: req.body.name,
      Image: req.file.filename,
      price: req.body.price,
      typeBuy: req.body.typeBuy,
      Description: req.body.description,
      Storage: req.body.storage,
      Origin: req.body.origin,
      Usage: req.body.usage,
    });
    pro.save(function (err) {
      if (err) {
        res.json({kq: 0, errMeg: err});
      } else {
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('/admin/product/List');
      }
    });
  }
});

router.get('/list', isLoggedIn, function (req, res) {
  var success_msg = req.flash('success_msg')[0];
  var perPage = 8;
  var page = parseInt(req.query.page) || 1;
  Product.find({})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Product.count().exec(function (err, count) {
        if (err) return next(err);
        res.render('admin/product/List', {
          layout: false,
          product: products,
          current: page,
          hasNextPage: perPage * page < count,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          pages: Math.ceil(count / perPage),
          user: req.user,
          success_msg: success_msg,
        });
      });
    });
});

router.post('/list', isLoggedIn, function (req, res) {
  var find = req.body.findProduct;
  var perPage = 8;
  var page = parseInt(req.query.page) || 1;
  Product.find({Name: {$regex: find}})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Product.count().exec(function (err, count) {
        if (err) return next(err);
        res.render('admin/product/List', {
          layout: false,
          product: products,
          current: page,
          hasNextPage: perPage * page < count,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          pages: Math.ceil(count / perPage),
          user: req.user,
        });
      });
    });
});

router.get('/:id/edit', isLoggedIn, function (req, res) {
  Product.findById(req.params.id, function (err, data) {
    Cate.find().then(function (cate) {
      res.render('admin/product/Edit', {
        errors: null,
        product: data,
        cate: cate,
        layout: false,
        user: req.user,
      });
    });
  });
});
router.post(
  '/:id/edit',
  isLoggedIn,
  uploadImage.single('image'),
  async (req, res, next) => {
    const {id} = req.params;
    const {
      categoryUp,
      name,
      price,
      typeBuy,
      description,
      storage,
      origin,
      usage,
    } = req.body;
    try {
      const pro = await Product.findByIdAndUpdate(id, {
        Image: req.file.filename,
        CateId: categoryUp,
        Name: name,
        price: price,
        typeBuy: typeBuy,
        Description: description,
        Storage: storage,
        Origin: origin,
        Usage: usage,
      });
      pro.save();
      req.flash('success_msg', 'Đã Cập Nhật Thành Công');
      res.redirect('/admin/product/List');
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);
router.get('/:id/delete', isLoggedIn, (req, res) => {
  Product.findById(req.params.id).remove(function (err) {
    if (err) {
      res.json({kq: 0, error: err});
    } else {
      req.flash('success_msg', 'Đã Xoá Thành Công');
      res.redirect('/admin/product/List');
    }
  });
});
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.roles === 1) {
    return next();
  } else res.redirect('/');
}
