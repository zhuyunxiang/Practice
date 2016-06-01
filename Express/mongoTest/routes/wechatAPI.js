var express = require('express');
var wechat = require('wechat');
var router = express.Router();
var confParams = require('../conf');
var wechatActions = require('../wechat');
var fs = require("fs");
var wechatClient = {
    token: confParams.token,
    appid: confParams.appid,
};

router.use(express.query());

router.use('/auth', wechat(wechatClient, function(req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    if (message.FromUserName === 'diaosi') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else {
        // 回复高富帅(图文回复)
        res.reply([{
            title: '你来我家接我吧',
            description: '这是女神与高富帅之间的对话',
            picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
            url: 'http://nodeapi.cloudfoundry.com/'
        }]);
    }
}));

router.use('/getTickets', function(req, res, next) {
    wechatActions.getJSTicketWithURL(req.body.url, function(err, ticketResult) {
        res.json(ticketResult);
    });
});

router.use('/getAuthURL', function(req, res, next) {
    var url = wechatActions.getAuthURL(req.body.url);
    res.json({url:url});
});

router.use('/getUserInfo', function(req, res, next) {
    wechatActions.getUserByCode(req.body.code, function (err, result) {
        res.json(result);
    });
});

router.use('/getImgURL', function(req, res, next) {
    wechatActions.getMediaURL(req.body.serverId, function (err , result) {
        res.json({'url':result});
    });
});

router.use('/getImgById', function(req, res, next) {
    wechatActions.getMediaById(req.body.serverId, function (err , result) {
        console.log(err);
        console.log(result,'result');

    });
    res.json({'a':req.body.serverId});
});

// 跳转
router.use('/redirect', function(req, res, next) {
    console.log(req.query.url);
    var url = wechatActions.getAuthURL(req.query.url);
    res.redirect(url);
});

module.exports = router;
