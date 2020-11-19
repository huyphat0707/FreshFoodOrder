var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
  Image: {type: String},
  CateId: {type: Number, ref: 'cate'},
  Name: {type: String},
  price: {type: Number},
  typeBuy: {type: String},
  Description: {type: String},
  Storage: {type: String},
  Origin: {type: String},
  Usage: {type: String},
});
module.exports = mongoose.model('product', Product);
