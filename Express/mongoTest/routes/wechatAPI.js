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
            title: '测试',
            description: 'Just a Test!',
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

router.use('/getAccessToken', function(req, res, next) {
    wechatActions.getCommonToken(function (err, result) {
        res.json({token:result});
    });
});

router.use('/getUserInfo', function(req, res, next) {
    wechatActions.getUserByCode(req.body.code, function (err, result) {
        if (!result) {
            res.json(null);
            return false;
        }

        userService.getOne({openid: result.openid}, function(err, isExist) {
            var dataToReturn = result;
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
    var path = req.originalUrl;
    var len = path.indexOf("?");
    var url = (len > 0) ? path.substring(len+5) : req.query.url;
    // var url = wechatActions.getAuthURL(req.query.url);
    url = wechatActions.getAuthURL(url);
    console.log(url);
    res.redirect(url);
});

module.exports = router;
