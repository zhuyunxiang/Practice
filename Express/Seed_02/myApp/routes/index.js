var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.format({
        text: function() {
            res.send('hey');
        },

        html: function() {
            res.send('<p>hey1231</p>');
        },

        json: function() {
            res.send({
                message: 'hey'
            });
        }
    });
});

module.exports = router;
