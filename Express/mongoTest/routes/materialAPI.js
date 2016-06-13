var express = require('express');
var router = express.Router();
var confParams = require('../conf');
var materialService = require('../service/materialService');
// var userService = require('../service/userService');

router.use(express.query());

router.post('/save', function(req, res, next) {
	var dataTosave = req.body;

	materialService.save(dataTosave, function (err, result) {
		if (dataTosave._id) {
    		res.send("修改成功");
		} else {
    		res.send("添加成功");
		}
	});
});

router.use('/get', function(req, res, next) {
	var condition = req.body;
	if (condition && condition.type == 'neq') {
		condition = {openid: {'$ne': condition.openid}}
	}
	if (req.body && req.body.limitNum) {
		condition.limitNum = req.body.limitNum;
	}

	materialService.get(condition, function (err, result) {
	    res.json(result);
	});
});


module.exports = router;
