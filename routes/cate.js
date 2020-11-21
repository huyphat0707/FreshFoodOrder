var express = require('express');
var router = express.Router();
var multer = require('multer');
const uploadImage = require("../config/multer");
var Cate = require('../models/cate.js');
const Product = require('../models/product');

router.get('/add',isLoggedIn, (req, res, next) => {
	res.render('admin/cate/Add', { layout: false })
});
router.post('/add',isLoggedIn, uploadImage.single('imgCate'), (req, res, next) => {
	const file = req.file
	if (!file) {
		const error = new Error('Please upload a file')
		error.httpStatusCode = 400
		return next(error)
	} else {
		var cate = new Cate({
			cateID: req.body.cateID,
			imgCate: req.file.filename,
			name: req.body.nameCate,
		});
		cate.save(function (err) {
			if (err) {
				res.json({ "kq": 0, "errMeg": err });
			} else {
				req.flash('succsess_msg', 'Đã Thêm Thành Công');
				res.redirect('/admin/cate/Add');
			}
		});
	}
});
router.get('/list',isLoggedIn, (req, res, next) => {
	Cate.find().then(function (cate, err) {
		if (!err) {
			res.render('admin/cate/List', { layout: false, data: cate.reverse() });
		} else {
			res.json({ "kq": 0, 'error': err });
		}
	});
});
router.get('/:cateID/delete',isLoggedIn, (req, res, next) => {
	Cate.find({cateID: req.params.cateID}).deleteOne(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			Product.find({ name:req.body.oldCat }, (err, pro) => {
				console.log(pro);
			})
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/cate/List');
		}
	})
});
router.get('/:id/edit',isLoggedIn, function (req, res, next) {
	Cate.findById(req.params.id, function (err, data) {
		res.render('admin/cate/Edit', { errors: null, data: data, layout: false });
	});
});

router.post('/:id/edit',isLoggedIn, uploadImage.single('imgCate'), async (req, res, next) => {
	const { id } = req.params;
	const { cateID, name } = req.body;
	try {
		const cate = await Cate.findByIdAndUpdate(id, {
			cateID: cateID,
			name: name,
			imgCate: req.file.filename,
		});
		cate.save();
		res.redirect('/admin/cate/List');
	} catch (error) {
		console.log(error)
		res.send(error)
	}
});
module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.roles === 1) {
		return next();
	} else
		res.redirect('/');
};