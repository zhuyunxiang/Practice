var express = require('express');
var router = express.Router();
var friendService = require('../service/friendService');
// var userService = require('../service/userService');

router.use(express.query());

router.post('/', function(req, res, next) {
	var dataTosave = req.body;

	friendService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

router.post('/get', function(req, res, next) {
	var condition = req.body;
	friendService.groupCount(condition, function (err, result) {
	    res.json(result);
	});
});

module.exports = router;
