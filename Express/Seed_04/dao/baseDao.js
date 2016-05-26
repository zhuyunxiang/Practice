var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');

var pool = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 执行数据库操作
var query = function(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        // 建立连接，向表中插入值
        connection.query(sql, params, function(err, result) {
            callback(result, err);
            // 释放连接
            connection.release();
        });
    });
}

module.exports = {
    query: query,
    jsonWrite: jsonWrite
};
