const express = require('express');
const router = express.Router();
const BillDetail = require('../models/billDetail');

router.get('/listBillDetail', async (req, res) => {
    try {
        let BillDetailData = await BillDetail.find({billID: req.query.billID});
        return res.status(200).json({ListBillDetail : BillDetailData});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "có lỗi xảy ra"});
    }
});

module.exports = router;