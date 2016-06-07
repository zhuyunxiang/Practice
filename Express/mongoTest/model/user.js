var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/share');

var userSchema = new mongoose.Schema({
    openid: String,
    nickname: String,
    sex: String,
    language: String,
    city: String,
    province: String,
    country: String,
    headimgurl: String,
    username: String,
    password: String,
    email: String,
    head: String,
}, {
    collection: 'users'
});

var userModel = mongoose.model('User', userSchema);
// 构造方法
function User(user) {
    this.user = user;
};

// 保存用户信息
User.prototype.save = function(callback) {
    // var md5 = crypto.createHash('md5'),
    //     email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
    //     head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";

    var newUser = new userModel(this.user);

    newUser.save(function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

// 获取单个人信息
User.getOne = function(params, callback) {
    userModel.findOne(params, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

// 获取
User.get = function(params, callback) {
    userModel.find(params, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = User;
