var baseDao = require('../dao/baseDao');

var SQLList = {
	create: 'INSERT INTO `config`(`key`, `value`) VALUES(?, ?)'
};

var configParam = {
	appId : 'wxe18ddb834db8860d',
    appScript : '07d3754a8e7d03f741517bae768efca9',

	addConfig: function (k, v) {
		baseDao.query(SQLList.create, [k, v], function (result, err) {
			console.log(err);
		});
	}
};

module.exports = configParam;
