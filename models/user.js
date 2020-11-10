var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	username: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	phone: {
		type: Number,
		trim: true,
		required: true
	},
	roles: {
		type: Number,
		default: 0,
		trim: true,
	},
	date: {
		type: Date,
		default: Date.now
	},
	verify_token: {
		type: String,
		required: false
	  },
});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
userSchema.methods.encryptPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// kiểm tra mật khẩu có trùng khớp
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isGroupAdmin = function (checkRole) {
	if (checkRole === 1) {
		return true;
	} else {
		return false;
	}
};

module.exports = mongoose.model('User', userSchema);
