var mongoose = require('mongoose');
var config = require('../config/index').db;

mongoose.connect(config, {
	server: {
		poolSize: 20
	}
}, function(err){
	if(err) {
		console.error('connect to %s error', config, err.message);
		process.exit(1);
	}
});

require('./wx_user');
require('./wx_lottery');

exports.wx_user = mongoose.model('wx_user');
exports.wx_lottery = mongoose.model('wx_lottery');