var express = require('express');
var router = express.Router();
var multer = require('multer');
const uploadImage = require("../config/multer");
var Cate = require('../models/cate.js');

router.get('/them-cate.html', (req, res) => {
	res.render('admin/cate/them-cate', { layout: false })
})
router.post('/them-cate.html', uploadImage.single('imgCate'), (req, res, next) => {
	const file = req.file
	console.log(file);
	if (!file) {
		const error = new Error('Please upload a file')
		error.httpStatusCode = 400
		return next(error)
	} else {
		var cate = new Cate({
			imgCate: req.file.filename,
			name: req.body.nameCate,
		});
		cate.save(function (err) {
			if (err) {
				res.json({ "kq": 0, "errMeg": err });
			} else {
				req.flash('succsess_msg', 'Đã Thêm Thành Công');
				res.redirect('/admin/cate/danh-sach.html');
			}
		});
	}
});
router.get('/danh-sach.html', (req, res) => {
	Cate.find().then(function (cate, err) {
		if (!err) {
			res.render('admin/cate/danh-sach', { layout: false, data: cate });
		} else {
			res.json({ "kq": 0, 'error': err });
		}
	});
})
router.get('/:id/xoa-cate.html', (req, res) => {
	Cate.findById(req.params.id).remove(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/cate/danh-sach.html');
		}
	})
})
router.get('/:id/sua-cate.html', function (req, res) {
	Cate.findById(req.params.id, function (err, data) {
		res.render('admin/cate/sua-cate', { errors: null, data: data, layout: false });
	});
});

router.post('/:id/sua-cate.html', uploadImage.single('imgCate'), async(req, res, next) => {
	const {id} = req.params;
	const {name }= req.body;
	try {
		const cate = await Cate.findByIdAndUpdate(id,{
			name:name,
			imgCate:req.file.filename,
		});
		cate.save();
		res.redirect('/admin/cate/danh-sach.html');
	} catch (error) {
		console.log(error)
		res.send(error)
	}
});
module.exports = router;