const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');

router.post('/addBill', (req, res) => {
    let bill = new Bill({total: req.body.total});
    try {
        bill.save((err) => {
            if(err) {
                console.log('add bill false', err);
            }
        });
    } catch (error) {
        res.status(500).send('errrrrr', error); 
    }
});

router.get('/list', isLoggedIn, (req, res) => {
    Bill.find().then((listBill, err) => {
        if(err){
            res.json({'kq' : 0});
        }else {
            res.render('admin/bill/list', { layout: false, bill: listBill.reverse() });
        }
    })
});

router.get('/:id/edit',isLoggedIn, (req, res) => {
    Bill.findById(req.params.id, (err, data) => {
        if (err) {
            console.log('error bill edit', err);
        } else {
        res.render('admin/bill/edit', { errors: null, bill: data, layout: false });
        }
    });
});

router.post('/:id/edit',isLoggedIn, async(req, res, next) => {
    const {id} = req.params;
    const { date, total } = req.body;
    try {
        let bill = await Bill.findByIdAndUpdate(id, {total, date});
        bill.save();
        res.redirect('/admin/bill/list');
    } catch (error) {
        console.log(error)
		res.send(error)
    }
});

router.get('/:id/delete',isLoggedIn, (req, res) => {
	Bill.findById(req.params.id).remove(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/bill/list');
		}
	})
});
module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.roles === 1) {
		return next();
	} else
		res.redirect('/');
};