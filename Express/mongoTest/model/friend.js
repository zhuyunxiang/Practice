var crypto = require('crypto');
var mongoose = require('mongoose');

var friendSchema = new mongoose.Schema({
    type: String,
    friendInfo:  {type : mongoose.Schema.ObjectId, ref: 'User'},
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