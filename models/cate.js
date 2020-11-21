var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cate = new Schema({
	cateID: {
		type: Number,
		require: true,
		trim: true,
		unique: true
	},
	imgCate: String,
	name: String,
});

module.exports = mongoose.model('cate', Cate);
