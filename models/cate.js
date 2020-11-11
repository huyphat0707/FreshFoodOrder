var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cate = new Schema({
	cateID: Number,
	imgCate: String,
	name: String,
});

module.exports = mongoose.model('cate', Cate);
