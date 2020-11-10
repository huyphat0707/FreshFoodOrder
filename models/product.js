var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
	Image: String,
	CateId: String,
	Name: String,
    Price: Number,
    typeBuy: String,
	Description: String,
	Storage: String,
	Origin: String,
	Usage: String,
});

module.exports = mongoose.model('product', Product);
