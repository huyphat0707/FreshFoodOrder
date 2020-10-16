var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    Image           : String,
    CateId          : String,
    Name            : String,
    TypeBuy         : String,
    Price           : Number,
    Description     : String,
    Storage         : String,
    Origin          : String,
    Usage           : String
});

module.exports = mongoose.model('product', Product);
