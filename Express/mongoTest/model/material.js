var crypto = require('crypto');
var mongoose = require('mongoose');

var materialSchema = new mongoose.Schema({
    openid: String,
    title: String,
    serverId: String,
    imgUrl: String,
    brif: String,
    desc: String,
    product_href: String,
    org_url: String,
    img_is_local: String,
    custom_read_count: Number,
    read_count: Number,
    created_at: {type: Date, default: Date.now},
    userID:  {type : mongoose.Schema.ObjectId, ref: 'User'}
});

var materialModel = mongoose.model('Material', materialSchema);

// 构造方法
function Material(material) {
    this.material = material;
};

// 修改素材
Material.prototype.save = function(callback) {
    var newMaterial = new materialModel(this.material);
    newMaterial.save(function(err, data) {
        console.log(err);
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};

// 获取素材 包括设置个数限制
Material.get = function (params, callback) {
    var limitNum = null;
    if (params.limitNum) {
        limitNum = params.limitNum;
        delete params.limitNum;
    }

    materialModel.find(params)
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

// 更新素材信息
Material.update = function (condition, model, callback) {
    console.log(condition);
    if(condition['_id']){
        condition['_id'] = mongoose.Types.ObjectId(condition['_id']);
    }
    materialModel.update(condition, model, {upsert : true}, callback);
}

// 获取单条记录
Material.getOne = function (params, callback) {
    materialModel.findoNE(params)
    .populate('userID')
    .exec(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

module.exports = Material;
