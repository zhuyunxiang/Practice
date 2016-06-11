var express = require('express');
var router = express.Router();
var confParams = require('../conf');
var historyService = require('../service/historyService');
// var userService = require('../service/userService');

router.use(express.query());

router.post('/', function(req, res, next) {
	var dataTosave = req.body;

	historyService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

router.post('/get', function(req, res, next) {
	console.log(req.body);
	var condition = req.body;

	historyService.get(condition, function (err, result) {
	    res.json(result);
	});
});

router.use('/test', function (req, res, next) {
	historyService.groupCount({}, function (err, result) {
		console.log(result);
		res.json(result);
	});
});


module.exports = router;
