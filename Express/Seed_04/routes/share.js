var express = require('express');
var router = express.Router();
var url = require('url');

var OAuth = require('wechat-oauth');
var confParams = require('../conf/conf');
var client = new OAuth(confParams.appId, confParams.appScript);
/* GET users listing. */
router.get('/', function(req, res, next) {
    // var url = client.getAuthorizeURL('http://zhuyunxiang.com/share/share/a', 'STATE', 'snsapi_userinfo');
    // var url = client.getAuthorizeURL('http://zhuyunxiang.com/zyx/index.html', 'STATE', 'snsapi_userinfo');
    var url = client.getAuthorizeURL('http://zhuyunxiang.com/share_client/a_test/index.html', 'STATE', 'snsapi_userinfo');
    res.render('index', {
        title: 'Hello world',
        message: 'wechat world!',
        url: url
    });
});

// /* GET users listing. */
// router.get('/a', function(req, res, next) {
//     var arg = url.parse(req.url, true).query;
//     client.getAccessToken(arg.code, function(err, result) {
//         var accessToken = result.data.access_token;
//         var openid = result.data.openid;
//         client.getUser(openid, function(err, result) {
//             var userInfo = result;
//             // console.log(userInfo);
//             // res.json(userInfo);
//             res.render('share', {userInfo: userInfo});
//         });
//     });
// });

/* GET users listing. */
router.post('/getUserInfo', function(req, res, next) {
	// res.json(req);

	var code = req.body.code;
    // var arg = url.parse(req.url, true).query;
    client.getAccessToken(code, function(err, result) {
        if (!result.data) {
            res.send("invalid code");
        }
        var accessToken = result.data?result.data.access_token:'';
        var openid = result.data?result.data.openid:'';
        client.getUser(openid, function(err, result) {
            var userInfo = result;
            userInfo.globalInfo = confParams;
            // console.log(userInfo);
            res.json(userInfo);
            // res.render('share', {userInfo: userInfo});
        });
    });
});


module.exports = router;
