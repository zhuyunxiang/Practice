var cacheService = require('../service/cacheService');
var OAuth = require('wechat-oauth');
var confParams = require('../conf');
var sign = require('./sign');
var Cache = new cacheService.cacheService();
var client = new OAuth(confParams.appid, confParams.appsecret);

// 获取JS Token
var getJSToken = function(callback) {
    var url = 'https://api.weixin.qq.com/cgi-bin/token';
    var info = {
        grant_type: 'client_credential',
        appid: client.appid,
        secret: client.appsecret,
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    client.request(url, args, callback);
};

// 获取user
var getUserByCode = function(code, callback) {
    client.getUserByCode(code, callback);
};

// 根据Token获取Ticket
var getJSTicketByToken = function(access_token, callback) {
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
    var info = {
        access_token: access_token,
        type: 'jsapi',
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    client.request(url, args, callback);
};

// 获取Common Token
var getCommonToken = function(callback) {
    // Cache.clear();
    // var commonToken ;
    var commonToken = Cache.get('commonToken');
    if (!commonToken) {
        var url = 'https://api.weixin.qq.com/cgi-bin/token';
        var info = {
            grant_type: 'client_credential',
            appid: client.appid,
            secret: client.appsecret
        };
        var args = {
            data: info,
            dataType: 'json'
        };
        client.request(url, args, function (err, result) {
            if (result.access_token) {
                commonToken = result.access_token;
                Cache.set('commonToken', commonToken, 5000000);
            }
            callback(err, result.access_token);
        });
    } else {
        callback("no error", commonToken);
    }
};

// 根据Token获取Ticket
var getMediaByToken = function(access_token, serverId, callback) {
    var url = 'http://file.api.weixin.qq.com/cgi-bin/media/get';
    var info = {
        access_token: access_token,
        media_id: serverId,
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    client.request(url, args, callback);
};

// 根据ServerID获取图片
var getMediaById = function (serverId, callback) {
    getCommonToken(function (err, result) {
        if (result) {
            getMediaByToken(result, serverId, callback);
        }
    });
}

// 获取图片地址
var getMediaURL = function (serverId, callback) {
    getCommonToken(function (err, result) {
        if (result) {
            var url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='+result+'&media_id='+serverId;
            callback(err, url);
        }
    });
}

// 获取Tickets
var getJSTicket = function(callback) {
    var JSTicket  = Cache.get('JSTicket');
    // check Cache
    if (!JSTicket) {

        getJSToken(function(err, result) {
            if (err) {
                return callback(err);
            }
            getJSTicketByToken(result.access_token, function (getJSTokenerror, JSTicketResult) {
                // store to Cache
                Cache.set('JSTicket', JSTicketResult, 7000000);
                callback(getJSTokenerror, JSTicketResult);
            });
        });
    } else {
        callback('none', JSTicket);
    }
};

// 根据url获取签名
var getJSTicketWithURL = function (urlPath, callback) {
    getJSTicket(function(err, ticketResult) {
        if (ticketResult && ticketResult.ticket) {
            // 进行签名操作
            var tickets = sign(ticketResult.ticket, urlPath);
            tickets.appid = confParams.appid;
            callback(err, tickets);
        };
    });
}

var getAuthURL = function (url) {
    return client.getAuthorizeURL(url, 'STATE', 'snsapi_userinfo');
}

module.exports.getJSToken = getJSToken;
module.exports.getJSTicketByToken = getJSTicketByToken;
module.exports.getJSTicket = getJSTicket;
module.exports.getJSTicketWithURL = getJSTicketWithURL;
module.exports.getAuthURL = getAuthURL;
module.exports.getUserByCode = getUserByCode;
module.exports.getCommonToken = getCommonToken;
module.exports.getMediaById = getMediaById;
module.exports.getMediaURL = getMediaURL;
