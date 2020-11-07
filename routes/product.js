var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');


var Product = require('../models/product.js');
var Cate = require('../models/cate.js');
const uploadImage = require('../config/multer.js');


router.get('/',isLoggedIn, function (req, res) {
	res.redirect('/admin/product/List', { layout: false });
});

router.get('/add',isLoggedIn, (req, res) => {
	Cate.find().then(function (cate) {
		res.render('admin/product/Add', { errors: null, cate: cate, layout: false });
	});

});
router.post('/add',isLoggedIn, uploadImage.single('image'), function (req, res, next) {
	const file = req.file
	if (!file) {
		const error = new Error('Please upload a file')
		error.httpStatusCode = 400
		return next(error)
	} else {
		var pro = new Product({
			CateId: req.body.category,
			Name: req.body.name,
			Image: req.file.filename,
			Price: req.body.price,
			Description: req.body.description,
			Storage: req.body.storage,
			Origin: req.body.origin,
			Usage: req.body.usage
		});
		pro.save(function (err) {
			if (err) {
				res.json({ "kq": 0, "errMeg": err });
			} else {
				req.flash('succsess_msg', 'Đã Thêm Thành Công');
				res.redirect('/admin/product/List');
			}
		});
	}

})

router.get('/list',isLoggedIn, function (req, res) {
	Product.find().then(function (pro, err) {
		if (err) {
			res.json({ 'kq': 0 })
		} else {
			res.render('admin/product/List', { layout: false, product: pro });
		}
	});
});
router.get('/:id/edit',isLoggedIn, function (req, res) {
	Product.findById(req.params.id, function (err, data) {
		Cate.find().then(function (cate) {
			res.render('admin/product/Edit', { errors: null, product: data, cate: cate, layout: false });
		});
	});
});
router.post('/:id/edit',isLoggedIn, uploadImage.single('image'), async (req, res, next) => {
	const { id } = req.params;
	const { categoryUp, name, price, description } = req.body;
	try {
		const pro = await Product.findByIdAndUpdate(id, {
			Image: req.file.filename,
			CateId: categoryUp,
			Name: name,
			Price: price,
			Description: description,
		});
		pro.save();
		res.redirect('/admin/product/List');
	} catch (error) {
		console.log(error)
		res.send(error)
	}
});
router.get('/:id/delete',isLoggedIn, (req, res) => {
	Product.findById(req.params.id).remove(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/product/List');
		}
	})
})
module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.roles === 'ADMIN') {
		return next();
	} else
		res.redirect('/');
};
