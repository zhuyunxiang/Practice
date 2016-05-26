var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var confParams = require('../conf/conf');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/add/:task_id/:applyer/:apply_reason/:state', function(req, res, next) {
    // userDao.add(req, res, next);
    // res.send('respond with a resource 123');
});

router.get('/aaa', function (req, res, next) {
    confParams.aaa = 'aaa';
    console.log(confParams);
    res.json(confParams);
});

router.get('/bbb', function (req, res, next) {
    confParams.bbb = 'bbb';
    console.log(confParams);
    res.json(confParams);
});

module.exports = router;
