var express = require('express');
var router = express.Router();
var userService = require('../service/userService');

// 根据openid获取用户信息
router.get('/:openid', function(req, res, next) {
    userService.getOne({openid: req.params.openid}, function (err, result) {
        res.json(result);
    });
    if (req.params.openid) {
        
    } else {
        userService.get({}, function (err, result) {
            res.json(result);
        });
    }
});

// 获取用户信息
router.get('/', function(req, res, next) {
    userService.get({}, function (err, result) {
        res.json(result);
    });
});

// 添加个人信息
router.use('/add', function(req, res, next) {
    userService.get({}, function (err, result) {
        res.json(result);
    });
});

module.exports = router;
