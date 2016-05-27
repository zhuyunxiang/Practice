var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    head: String,
    open_id: String,
    headimgurl: String
}, {
    collection: 'users'
});

var userModel = mongoose.model('User', userSchema);

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
};

User.prototype.save = function(callback) {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    var user = {
        username: this.username,
        password: this.password,
        email: this.email,
        head: head
    };

    var newUser = new userModel(user);

    newUser.save(function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.getByName = function(name, callback) {
    userModel.findOne({
        username: name
    }, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = User;
