const mongoose = require('mongoose');
const billDetail = new mongoose.Schema({
    nameProduct: {
        type: String,
        required: true,
        trim: true
    },

    imageProduct: {
        type: String,
        required: true,
        trim: true
    },

    priceProduct: {
        type: Number,
        required: true,
        trim: true
    },

    count: {
        type: Number,
        required: true,
        trim: true
    },

    pay: {
        type: Number,
        required: true,
        trim: true
    },

    billID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('billDetail', billDetail);