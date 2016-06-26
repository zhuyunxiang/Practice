var FriendModel = require('../model/friend');

var FriendService = {
    add: function (friend, callback) {
        var friendEntity = new FriendModel(friend);
        friendEntity.save(callback);
    },
    get: function (condition, callback) {
    	if (condition) {
    		FriendModel.get(condition, callback);
    	} else {
    		FriendModel.get({}, callback);
    	}
    }
};

module.exports = FriendService;