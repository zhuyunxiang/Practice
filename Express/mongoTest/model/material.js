var crypto = require('crypto');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/share');

var materialSchema = new mongoose.Schema({
    openid: String,
    title: String,
    serverId: String,
    imgUrl: String,
    brif: String,
    desc: String,
    img_is_local: String
}, {
    collection: 'materials'
});

var materialModel = mongoose.model('Material', materialSchema);

function Material(material) {

    this.material = material;
};

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

Material.get = function (params,callback) {
    materialModel.find(params, function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

module.exports = Material;
