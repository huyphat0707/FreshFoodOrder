const express = require('express');
const router = express.Router();
const Bill  = require('../models/bill');

router.get('/allBill', async (req, res) => {
    try {
        let BillData = await Bill.find();
        return res.status(200).json({AllBill: BillData});
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg: "Có lỗi xảy ra"});
    }
});

module.exports = router;
