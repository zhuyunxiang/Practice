var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');

var pool = mysql.createPool($util.extend({}, $conf.mysql));

var queryInDB = function(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        // 建立连接，向表中插入值
        connection.query(sql, params, function(err, result) {
            callback(result, err);
            // 释放连接
            connection.release();
        });
    });
}

/*
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
    return queryInDB('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = ?', [bearerToken], function(result, err) {
        if (result) {
            var token = result[0];
            return {
                accessToken: token.access_token,
                clientId: token.client_id,
                expires: token.expires,
                userId: token.userId
            };
        } else {
            return false;
        }
    });
};

/**
 * Get client.
 */
module.exports.getClient = function*(clientId, clientSecret) {
    return queryInDB('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = ? AND client_secret = ?', [clientId, clientSecret], function(result, err) {
        if (result) {
            var oAuthClient = result[0];
            return {
                clientId: oAuthClient.client_id,
                clientSecret: oAuthClient.client_secret
            };
        } else {
            return false;
        }
    });
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function*(bearerToken) {
    return queryInDB('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = ?', [bearerToken], function(result, err) {
        return result.rowCount ? result[0] : false;
    });
};

/*
 * Get user.
 */

module.exports.getUser = function*(username, password) {
    return queryInDB('SELECT id FROM users WHERE username = ? AND password = ?', [username, password], function(result) {
        return result.rowCount ? result[0] : false;
    });
};

/**
 * Save token.
 */

module.exports.saveAccessToken = function*(token, client, user) {
    return queryInDB('INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES (?, ?, ?, ?)', [
        token.accessToken,
        token.accessTokenExpiresOn,
        client.id,
        token.refreshToken,
        token.refreshTokenExpiresOn,
        user.id
    ], function(result) {
        return result.rowCount ? result[0] : false;
    });
};
