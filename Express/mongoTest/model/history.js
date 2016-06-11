var crypto = require('crypto');
var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    material_id: mongoose.Schema.ObjectId,
    type: String,
    userID:  {type : mongoose.Schema.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now}
});

var HistoryModel = mongoose.model('History', historySchema);

// 构造方法
function History(history) {
    this.history = history;
};

// 修改素材
History.prototype.save = function(callback) {
    var newhistory = new HistoryModel(this.history);
    newhistory.save(function(err, data) {
        console.log(err);
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};

History.get = function (params, callback) {
    var limitNum = null;
    if (params.limitNum) {
        limitNum = params.limitNum;
        delete params.limitNum;
    }

    HistoryModel.find(params)
    .limit(limitNum)
    .sort({'_id': -1})
    .populate('userID')
    .exec(function (err, user) {
        // console.log(user);
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

History.groupCount = function (condition, callback) {
    HistoryModel.aggregate([
        
        {   
            $project : {    
                material_id : 1 , 
                created_at: 1,   
                count: 1 ,
                userID: 1
            } 
        },
        { 
            $match : condition
        },
        {
            $group: {
                _id: '$userID',  //$region is the column name in collection
                count: {$sum: 1},
                time: {$max: '$created_at'}
                // material_id: '$material_id'
            }
        } ,
    ], function (err, result) {
        if (err) {
            // next(err);
        } else {
            // res.json(result);
        }
            callback(err, result);
    });
 
}

module.exports = History;