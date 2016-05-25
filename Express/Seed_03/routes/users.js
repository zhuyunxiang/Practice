var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/add/:task_id/:applyer/:apply_reason/:state', function(req, res, next) {
    userDao.add(req, res, next);
    // res.send('respond with a resource 123');
});

module.exports = router;
