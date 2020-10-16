var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cate = new Schema({
    imgCate     : String, 
    name         : String,
});

module.exports = mongoose.model('cate', Cate);
