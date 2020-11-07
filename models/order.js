var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
    firstName		: String,
    lastName        : String,
    phone           : Number,
    email 			: String,
    address   		: String,
    city            : String,
    cart 		    : Object,
    sl              : Number,
    money            : Number
});
module.exports = mongoose.model('order', Cart);