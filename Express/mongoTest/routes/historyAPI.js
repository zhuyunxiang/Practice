var express = require('express');
var router = express.Router();
var confParams = require('../conf');
var historyService = require('../service/historyService');
var friendService = require('../service/friendService');

router.use(express.query());

router.post('/', function(req, res, next) {
	var dataTosave = req.body;
	if (dataTosave.type == 'shared') {
		var friendInfo = {
			self: dataTosave.author_id,
			friendInfo: dataTosave.userID
		}
		delete dataTosave.author_id;

		friendService.get(friendInfo, function (err, result) {
			if (result.length<=0) {
				friendService.add(friendInfo, function (fadderr, faddresult) {
					// Do nothing
				});
			}
		});
	}

	historyService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

router.post('/get', function(req, res, next) {
	var condition = req.body;
	historyService.groupCount(condition, function (err, result) {
	    res.json(result);
	});
});

router.use('/test', function (req, res, next) {
	historyService.groupCount({}, function (err, result) {
		console.log(result);
		// res.json(result);
	});

	res.json({});
});

module.exports = router;
