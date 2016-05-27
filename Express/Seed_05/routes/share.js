var express = require('express');
var router = express.Router();
var url = require('url');

var OAuth = require('wechat-oauth');
var confParams = require('../conf/conf');
var sign = require('../conf/sign');
var client = new OAuth(confParams.appId, confParams.appScript);
/* GET users listing. */
router.get('/', function(req, res, next) {
    // var url = client.getAuthorizeURL('http://zhuyunxiang.com/share/share/a', 'STATE', 'snsapi_userinfo');
    var url = client.getAuthorizeURL('http://zhuyunxiang.com/zyx/index.html', 'STATE', 'snsapi_userinfo');
    var zyxurl = client.getAuthorizeURL('http://zhuyunxiang.com/share_client/a_test/index.html', 'STATE', 'snsapi_userinfo');
    res.render('index', {
        title: 'Hello world',
        message: 'wechat world!',
        url: url,
        zyxurl: zyxurl
    });
});

/* GET users listing. */
router.post('/getUserInfo', function(req, res, next) {
	var code = req.body.code;
    client.getUserByCode(code, function(err, result) {
        if (result) {
            res.json(result);
        }
        // res.render('share', {userInfo: userInfo});
    });
});

/* GET users listing. */
router.use('/getTickets', function(req, res, next) {
    client.getJSTicket(function (err, ticketResult) {
        if (ticketResult && ticketResult.ticket) {
            var tickets = sign(ticketResult.ticket, req.body.url);
            tickets.appId = confParams.appId;
            res.json(tickets);
        };
    });
});


module.exports = router;
