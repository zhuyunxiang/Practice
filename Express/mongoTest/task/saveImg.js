var scheduleService = require('../service/scheduleService');
var materialService = require('../service/materialService');
var wechatActions = require('../wechat');
var fileService = require('../service/fileService');

// 每天夜里执行
scheduleService.execEveryNight(function () {
	console.log("2.00执行任务");
	wechatActions.getCommonToken(function (err, token) {
	    materialService.get({img_is_local: {$ne: 'local'}}, function (mserr, data) {
			for (var i = data.length - 1; i >= 0; i--) {
				var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + token + "&media_id=" + data[i]['serverId'];
				// 异步操作这里要用闭包
				(function () {
					var dataItem = data[i];
					fileService.saveFile(url, './public/images/'+data[i]['serverId'], function (fileInfo, err) {
						materialService.save({_id:dataItem._id, img_is_local:'local', imgUrl:fileInfo.filePath}, function (saveerr, result) {
							console.log(result);
						});
					});
				})();
				// break;
			}
		});
	});
});

var saveImgTask = {}

module.exports = saveImgTask;