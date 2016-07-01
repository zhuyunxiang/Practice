var express = require('express');
var wechat = require('wechat');
var router = express.Router();
var confParams = require('../conf');
var wechatActions = require('../wechat');
var userService = require('../service/userService');

var wechatClient = {
    token: confParams.token,
    appid: confParams.appid,
};

router.use(express.query());

// 获取Tickets
router.use('/getTickets', function(req, res, next) {
    wechatActions.getJSTicketWithURL(req.body.url, function(err, ticketResult) {
        res.json(ticketResult);
    });
});

// 获取当前地址要进行微信处理的地址
router.use('/getAuthURL', function(req, res, next) {
    var url = wechatActions.getAuthURL(req.body.url);
    res.json({url:url});
});

// 获取Token
router.use('/getAccessToken', function(req, res, next) {
    wechatActions.getCommonToken(function (err, result) {
        res.json({token:result});
    });
});

// 根据用户code获取用户信息
router.use('/getUserInfo', function(req, res, next) {
    wechatActions.getUserByCode(req.body.code, function (err, result) {
        // 获取不到用户信息
        if (!result) {
            res.json(null);
            return false;
        }
        // 从本地数据库获取openid的用户信息
        userService.getOne({openid: result.openid}, function(err, isExist) {
            var dataToReturn = result;
            // 如果数据库不存在就添加
            if (!isExist) {
                userService.add(result, function(err, addResult) {
                    if (addResult) {
                        dataToReturn._id = addResult._id;
                    }
                    res.json(dataToReturn);
                });
            } else {
                res.json(isExist);
            }
        });
    });
});

// 根据serverId获取微信上传的图片地址
router.use('/getImgURL', function(req, res, next) {
    wechatActions.getMediaURL(req.body.serverId, function (err , result) {
        res.json({'url':result});
    });
});

// 跳转
router.use('/redirect', function(req, res, next) {
    var path = req.originalUrl;
    var len = path.indexOf("?");
    var url = (len > 0) ? path.substring(len+5) : req.query.url;
    // var url = wechatActions.getAuthURL(req.query.url);
    url = wechatActions.getAuthURL(url);
    res.redirect(url);
});

module.exports = router;
