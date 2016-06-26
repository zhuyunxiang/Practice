var crypto = require('crypto');
var mongoose = require('mongoose');

var friendSchema = new mongoose.Schema({
    type: String,
    friendInfo:  {type : mongoose.Schema.ObjectId, ref: 'User'},
    self:  {type : mongoose.Schema.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now}
});

var FriendModel = mongoose.model('Friend', friendSchema);

// 构造方法
function Friend(friend) {
    this.friend = friend;
};

// 修改素材
Friend.prototype.save = function(callback) {
    var dataToSave = this.friend;
    var newFriend = new FriendModel(dataToSave);
    newFriend.save(function(err, data) {
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            callback(null, data);
        }
    });
};

Friend.get = function (params, callback) {
    if (params && params['self']) {
        params['self'] = mongoose.Types.ObjectId(params['self']);
    }
    if (params && params['friendInfo']) {
        params['friendInfo'] = mongoose.Types.ObjectId(params['friendInfo']);
    }

    FriendModel.find(params)
    .sort({'_id': -1})
    .populate(['friendInfo'])
    .exec(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

module.exports = Friend;