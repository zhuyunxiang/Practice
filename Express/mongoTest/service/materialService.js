var MaterialModel = require('../model/material');

var MaterialService = {
    add: function (material, callback) {
        var materialEntity = new MaterialModel(material);
        materialEntity.save(callback);
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
