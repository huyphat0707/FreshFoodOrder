var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  address: {type: String, required: true},
  city: {type: String, required: true},
  paymentId: {type: String, required: true},
});
module.exports = mongoose.model('order', Cart);
