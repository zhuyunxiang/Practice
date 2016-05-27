var UserModel = require('../model/user');

var userService = {
    getByName: function (name, callback) {
        UserModel.getByName(name, function (err, results) {
            callback(err, results);
        });
    },
    add: function (user, callback) {
        var userEntity = new UserModel(user);
        userEntity.save(callback);
    }
};

module.exports = userService;
