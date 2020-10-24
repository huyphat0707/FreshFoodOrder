var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
 username       : {type:String},
 email 			: {type:String, unique:true},
 password 		: {type:String},
 phone          : {type:Number},
 roles          : {type:String, default:'MEMBER'},
});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// kiểm tra mật khẩu có trùng khớp
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isGroupAdmin = function(checkRole){
    if(checkRole === "ADMIN"){
        return true;
    } else {
        return false;
    };

};

module.exports = mongoose.model('User', userSchema);