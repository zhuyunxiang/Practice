var express = require('express');
var router = express.Router();
var confParams = require('../conf');
var historyService = require('../service/historyService');
var friendService = require('../service/friendService');

router.use(express.query());

// 添加历史记录
router.post('/', function(req, res, next) {
	var dataTosave = req.body;
	if (dataTosave.type == 'shared') {
		
		var friendInfo = {
			self: dataTosave.author_id,
			friendInfo: dataTosave.userID,
			type: 'beShared'
		};

		var sharefriendInfo = {
			self: dataTosave.userID,
			friendInfo: dataTosave.author_id,
			type: 'share'
		}

		friendService.get(friendInfo, function (err, result) {
			if (!result || result.length <= 0) {
				friendService.add(friendInfo, function (fadderr, faddresult) {
					// Do nothing
				});
			}
		});

		friendService.get(sharefriendInfo, function (err, result) {
			if (!result || result.length <= 0) {
				friendService.add(sharefriendInfo, function (fadderr, faddresult) {
					// Do nothing
				});
			}
		});
		delete dataTosave.author_id;
	}

	historyService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

// 根据条件获取浏览记录
router.post('/get', function(req, res, next) {
	var condition = req.body;
	historyService.groupCount(condition, function (err, result) {
	    res.json(result);
	});
});

module.exports = router;
