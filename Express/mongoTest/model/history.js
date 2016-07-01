var crypto = require('crypto');
var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    material_id: mongoose.Schema.ObjectId,
    type: String,
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    sharedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

var HistoryModel = mongoose.model('History', historySchema);

// 构造方法
function History(history) {
    this.history = history;
};

// 修改素材历史
History.prototype.save = function(callback) {
    var dataToSave = this.history;
    if (dataToSave && dataToSave.sharedUser) {
        // dataToSave.sharedUser = mongoose.Types.ObjectId(dataToSave.sharedUser);
    }
    var newhistory = new HistoryModel(dataToSave);
    newhistory.save(function(err, data) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        callback(null, data);
    });
};

// 获取素材历史
History.get = function(params, callback) {
    var limitNum = null;
    if (params.limitNum) {
        limitNum = params.limitNum;
        delete params.limitNum;
    }

    if (params.userID) {
        params.userID = mongoose.Types.ObjectId(params.userID);
    }

    if (params.sharedUser) {
        params.sharedUser = mongoose.Types.ObjectId(params.sharedUser);
    }

    HistoryModel.find(params)
        .limit(limitNum)
        .sort({
            '_id': -1
        })
        .populate(['userID', 'sharedUser'])
        .exec(function(err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user);
        });
}

History.groupCount = function(condition, callback) {
    if (condition && condition.material_id) {
        condition.material_id = mongoose.Types.ObjectId(condition.material_id);
    }

    if (condition.sharedUser) {
        condition.sharedUser = mongoose.Types.ObjectId(condition.sharedUser);
    }

    HistoryModel.aggregate([{
        $project: {
            material_id: 1,
            created_at: 1,
            count: 1,
            userID: 1,
            type: 1,
            sharedUser: 1
        }
    }, {
        $match: condition
    }, {
        $group: {
            _id: '$userID',
            count: {
                $sum: 1
            },
            time: {
                $max: '$created_at'
            },
            userID: {
                $max: '$userID'
            }
        }
    }, ])
        .exec(function(err, result) {
            var opts = [{
                path: 'userID',
            }];
            HistoryModel.populate(result, opts, function(a, b) {
                // body...
                callback(a, b);
            });
        });

}

module.exports = History;