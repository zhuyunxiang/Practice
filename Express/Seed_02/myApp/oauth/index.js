var $config = require('../conf/db');
// var oauthserver = require('express-oauth-server');

// var mysql = require('mysql');

var oauth = require('./oauth');
var auth = oauthserver({
	model: {},
	grants: ['password'],
  debug: true
});

module.exports.server = auth;
// module.exports.oauth = oauth;
// module.exports.User = require('./user');
// module.exports.OAuthClientsModel = require('./oauth_client');
// module.exports.mongoose = mongoose;
