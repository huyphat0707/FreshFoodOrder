const mongoose = require('mongoose');
let today = new Date();
let date =
	today.getDate() +
	'/' +
	(today.getMonth() + 1) +
	'/' +
	today.getFullYear() +
	' - ' +
	today.getHours() +
	':' +
	today.getMinutes();
const BillSchema = new mongoose.Schema({
	total: {
		type: Number,
		required: true,
		trim: true,
	},
	date: {
		type: String,
		required: true,
		trim: true,
		default: date,
	},
});
module.exports = mongoose.model('bill', BillSchema);
