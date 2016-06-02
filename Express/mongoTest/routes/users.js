var express = require('express');
var router = express.Router();
var userService = require('../service/userService');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


/* GET users listing. */
router.use('/add', function(req, res, next) {
    
    userService.get({}, function (err, result) {
        console.log(result);
        res.json(result);
    });

});

module.exports = router;
