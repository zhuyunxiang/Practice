var UserModel = require('../model/user');

var userService = {
    get: function (params, callback) {
        UserModel.get(params, function (err, results) {
            callback(err, results);
        });
    },

    getOne: function (params, callback) {
        UserModel.getOne(params, function (err, results) {
            callback(err, results);
        });
    },
    
    add: function (user, callback) {
        var userEntity = new UserModel(user);
        userEntity.save(callback);
    }
};

module.exports = userService;
