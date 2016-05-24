var bcrypt = require('bcryptjs');
var baseDao = require('../dao/baseDao');

function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function add(params) {
    params = ['zhuyunxiang', 'zzyyxx'];
    var sql = "INSERT INTO users(username, password) VALUES (?, ?)";
    baseDao.query(sql, params, function (result, err) {
        console.log(result);
    });
}

module.exports.hashPassword = hashPassword;
module.exports.add = add;
