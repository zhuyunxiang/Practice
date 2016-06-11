var MaterialModel = require('../model/material');

var MaterialService = {
    save: function (material, callback) {
        if (material && material._id) {
            var condition = {_id: material._id};
            var dataToSave = material;
            delete dataToSave._id;
            materialEntity.update(condition, dataToSave, callback)
        } else if(material&&!material._id){
            var materialEntity = new MaterialModel(material);
            materialEntity.save(callback);
        }
    },
    get: function (condition, callback) {
    	if (condition) {
    		MaterialModel.get(condition, callback);
    	} else {
    		MaterialModel.get({}, callback);
    	}
    }
};

module.exports = MaterialService;
