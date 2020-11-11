const express = require('express');
const { count } = require('../models/billDetail');
const router = express.Router();
const BillDetail = require('../models/billDetail');

router.post('/addBillDetail', (req, res) => {
    let billDetail = new BillDetail({
        nameProduct: req.body.nameProduct,
        imageProduct: req.body.imageProduct,
        priceProduct: req.body.priceProduct,
        count: req.body.count,
        pay: req.body.pay,
        billID: req.body.billID
    });
    try {
        billDetail.save((err) => {
            if(err) {
                console.log('add billDetail false', err);
            }
        });
    } catch (error) {
        res.status(500).send('errrrrr', error); 
    }
});

router.get('/listBillDetail/:billID', async (req, res) => {
    try {
        BillDetail.find({billID: req.params.billID}).then((listBillDetail, err) => {
            if(err){
                res.json({'kq' : 0});
            }else {
                res.render('admin/billDetail/list', { layout: false, billDetail: listBillDetail });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id/edit',isLoggedIn, (req, res) => {
    BillDetail.findById(req.params.id, (err, data) => {
        if (err) {
            console.log('error bill edit', err);
        } else {
        res.render('admin/billDetail/edit', { errors: null, billDetail: data, layout: false });
        }
    });
});

router.post('/:id/edit', async(req, res, next) => {
    const {id} = req.params;
    const { count, pay } = req.body;
    try {
        let billDetail = await BillDetail.findByIdAndUpdate(id, {count, pay});
        billDetail.save();
        // res.redirect('/admin/billDetail/list');
    } catch (error) {
        console.log(error)
		res.send(error)
    }
});

router.get('/:id/delete',isLoggedIn, (req, res) => {
	BillDetail.findById(req.params.id).remove(function (err) {
		if (err) {
			res.json({ "kq": 0, 'error': err });
		} else {
			req.flash('succsess_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/billDetail/list');
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