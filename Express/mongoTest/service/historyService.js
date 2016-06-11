var HistoryModel = require('../model/history');

var HistoryService = {
    add: function (history, callback) {
        var historyEntity = new HistoryModel(history);
        historyEntity.save(callback);
    },
    get: function (condition, callback) {
    	if (condition) {
    		HistoryModel.get(condition, callback);
    	} else {
    		HistoryModel.get({}, callback);
    	}
    },

    groupCount: function (condition, callback) {
        HistoryModel.groupCount(condition, callback);
    }
};

module.exports = HistoryService;
