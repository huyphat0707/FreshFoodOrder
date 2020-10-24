var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

router.get('/list',isLoggedIn, (req, res, next) => {
	User.find().then(function (user, err) {
		if (!err) {
            res.render('admin/user/List', { layout: false, data: user });
		} else {
			res.json({ "kq": 0, 'error': err });
		}
	});
})

router.get('/:id/edit', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    User.findById(id).then(function (data) {
        res.render('admin/user/Edit', { data: data, layout: false });
    });
});

router.post('/:id/edit', isLoggedIn, function (req, res, next) {
    User.findById(req.params.id, function (err, data) {
        data.roles = req.body.roles;
        data.save();
        req.flash('succsess_msg', 'Đã Sửa Thành Công');
        res.redirect('/admin/user/' + req.params.id + '/Edit');
    });
});

router.get('/:id/delete', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    User.findOneAndRemove({ _id: id }, function (err, offer) {
        req.flash('succsess_msg', 'Đã Xoá Thành Công');
        res.redirect('/admin/user/List');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.roles === 'ADMIN') {
        return next();
    } else
        res.redirect('/admin/login');
};