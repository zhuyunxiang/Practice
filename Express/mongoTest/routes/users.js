var express = require('express');
var router = express.Router();
var userService = require('../service/userService');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


/* GET users listing. */
router.use('/add', function(req, res, next) {
    // userService.add({
    //     username: 'zhuyunxiang',
    //     password: 'zyx920826',
    //     email: 'zhuyunxiang.com',
    // }, function(err, res) {
    
    // });
    userService.getByName('zhuyunxiang', function (err, result) {
        console.log(result);
    });

    res.send('respond with a resource');
});

module.exports = router;
