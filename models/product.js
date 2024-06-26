var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
	image: { type: String },
	cateId: { type: Number, ref: 'cate' },
	name: { type: String },
	price: { type: Number },
	typeBuy: { type: String },
	description: { type: String },
	storage: { type: String },
	origin: { type: String },
	usage: { type: String },
	nutritional: { type: Object},
	viewCounts: {
		type: Number,
		required: false,
		default: 0,
	},
	comment: {
		total: {
			type: Number,
			require: false,
			default: 0,
		},
		items: [
			{
				title: {
					type: String,
				},
				content: {
					type: String,
				},
				name: {
					type: String,
				},
				date: {
					type: Date,
					default: Date.now,
				},
				star: {
					type: Number,
				},
			},
		],
	},
});
module.exports = mongoose.model('product', Product);
