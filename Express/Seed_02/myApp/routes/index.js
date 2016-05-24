var express = require('express');
var router = express.Router();

var oauthserver = require('oauth2-server');
var model = require('../oauth/model');
var user = require('../oauth/user');

var oauth = oauthserver({
    model: model,
    grants: ['password'],
    debug: true
});

// oauth.authorise(),

/* GET home page. */
router.get('/', function(req, res, next) {
    user.add();
    res.render('index', {
        title: 'Express'
    });
    // res.format({
    //     text: function() {
    //         res.send('hey');
    //     },
    //
    //     html: function() {
    //         res.send('<p>hey1231</p>');
    //     },
    //
    //     json: function() {
    //         res.send({
    //             message: 'hey'
    //         });
    //     }
    // });
});

module.exports = router;
