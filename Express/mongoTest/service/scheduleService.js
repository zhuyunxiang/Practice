var schedule = require("node-schedule");
var wechatActions = require('../wechat');

var scheduleService = {
	dayTask : function () {
		var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = [0, new schedule.Range(1, 6)];
		rule.hour = 22;
		rule.minute = 42;
		var j = schedule.scheduleJob(rule, function(){
	　　　　console.log("执行任务");
	　　});
	},

	execEveryNight: function (callback) {
		var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = [0, new schedule.Range(1, 6)];
		rule.hour = 2;
		rule.minute = 0;
		var j = schedule.scheduleJob(rule, callback);
	},

	test: function (callback) {
		var rule = new schedule.RecurrenceRule();
		var times = [];
		for(var i=1; i<60; i++){
			times.push(i);
		}
		rule.second = times;
		var c=0;
		var j = schedule.scheduleJob(rule, callback);
	}
}

module.exports = scheduleService;