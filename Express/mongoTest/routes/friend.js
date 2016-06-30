var express = require('express');
var router = express.Router();
var friendService = require('../service/friendService');
var materialService = require('../service/materialService');

router.use(express.query());

// 添加朋友
router.post('/', function(req, res, next) {
	var dataTosave = req.body;

	friendService.add(dataTosave, function (err, result) {
    	res.send("添加成功");
	});
});

// 获取朋友的素材
router.get('/:type/:uid', function(req, res, next) {
	condition = {'self': req.params.uid};

	friendService.getBase(condition, function (err, result) {
		var friendArr = [];
		result.forEach(function (friendItem) {
			if(friendArr.indexOf(friendItem['friendInfo'])<0){
				friendArr.push(friendItem['friendInfo']);
			}
		});

		var params = {userID: {$in: friendArr}};

		if (req.params.type == 'limit') {
			params['limitNum'] = 5;
		}

	    materialService.get(params, function (mtErr, materials) {
			res.json(materials);
		});
	});
});

module.exports = router;
