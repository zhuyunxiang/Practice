var express = require('express');
var router = express.Router();
var confParams = require('../conf');
var materialService = require('../service/materialService');
// var userService = require('../service/userService');

router.use(express.query());

router.post('/save', function(req, res, next) {
	var dataTosave = req.body;

	materialService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

router.use('/get', function(req, res, next) {
	var condition = req.body;
	if (condition.type == 'neq') {
		condition = {openid: {'$ne': condition.openid}}
	}
	materialService.get(condition, function (err, result) {
	    res.json(result);
	});
});


module.exports = router;
