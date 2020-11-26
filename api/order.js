const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/allOrder', async( req, res) => {
    try {
        let OrderData =  await Order.find();
        return res.status(200).json({Orders: OrderData});
    } catch (error) {
        
    }
});

module.exports = router;