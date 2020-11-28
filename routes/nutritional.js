const express = require('express');
const router = express.Router();

var Nutritional = require('../models/nutritional');
router.post('/add', (req, res, next) => {
    let nut = new Nutritional({
        nameProduct: req.body.nameProduct,
        d1: req.body.d1,
        d2: req.body.d2,
        d3: req.body.d3,
        d4: req.body.d4,
        d5: req.body.d5,
        d6: req.body.d6,
        d7: req.body.d7,
        d8: req.body.d8,
        d9: req.body.d9,
        d10: req.body.d10,
        d11: req.body.d11,
        d12: req.body.d12
    });
    nut.save(err => {
        if(err){
            res.json({kq: 0, errMeg: err});
        }else{
            req.flash('success_msg', 'Đã Thêm Thành Công');
        }
    })
});
module.exports = router;