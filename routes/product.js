var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');


var Product = require('../models/product.js');
var Cate = require('../models/cate.js');
const uploadImage = require('../config/multer.js');
const product = require('../models/product.js');


router.get('/', function (req, res) {
	res.redirect('/admin/product/danh-sach', { layout: false });
});

router.get('/them-product.html', (req, res) => {
	Cate.find().then(function (cate) {
		res.render('admin/product/them', { errors: null, cate: cate, layout: false });
	});

});
router.post('/them-product.html', uploadImage.single('image'), function (req, res, next) {
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
				res.redirect('/admin/product/danh-sach.html');
			}
		});
	}

})

router.get('/danh-sach.html', function (req, res) {
	Product.find().then(function (pro, err) {
		if (err) {
			res.json({ 'kq': 0 })
		} else {
			res.render('admin/product/danh-sach', { layout: false, product: pro });
		}
	});
});
router.get('/:id/sua-product.html', function (req, res) {
	Product.findById(req.params.id, function (err, data) {
		Cate.find().then(function (cate) {
			res.render('admin/product/sua', { errors: null, product: data, cate: cate, layout: false });
		});
	});
});
router.post('/:id/sua-product.html', uploadImage.single('image'), async (req, res, next) => {
	const { id } = req.params;
	const { categoryUp , name , price  ,description} = req.body;
	try {
		const pro = await Product.findByIdAndUpdate(id, {
			Image: req.file.filename,
			CateId : categoryUp,
			Name: name,
			Price: price,
			Description: description,
		});
		pro.save();
		res.redirect('/admin/product/danh-sach.html');
	} catch (error) {
		console.log(error)
		res.send(error)
	}
});
router.get('/:id/xoa-product.html', (req, res) => {
	Product.findById(req.params.id).remove(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/product/danh-sach.html');
		}
	})
})
module.exports = router;


