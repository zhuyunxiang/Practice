var express = require('express');
var router = express.Router();

var cache = require('../service/cacheService');
var cacheStore = cache.cacheService();

var oauthserver = require('oauth2-server');
var model = require('../auth/model');

router.oauth = oauthserver({
  model: {model}, // See below for specification
  grants: ['password'],
  debug: true
});

// router.all('/oauth/token', router.oauth.grant());
// router.oauth.authorise(),

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'Express'
    });
    next();
});

router.get('/get', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
    next();
});

module.exports = router;
