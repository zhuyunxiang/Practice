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

module.exports.getJSToken = getJSToken;
module.exports.getJSTicketByToken = getJSTicketByToken;
module.exports.getJSTicket = getJSTicket;
module.exports.getJSTicketWithURL = getJSTicketWithURL;