var logger = require('../common/logger');

module.exports = function(req, res, next) {
	if(exports.ignore.test(req.url)) {
		next();
		return;
	}
	
	var start = new Date();
	
	logger.info('\n\nStarted', start.toISOString(), req.method, req.url, req.ip);
	
	res.on('finish', function () {
		var duration = new Date() - start;

		logger.info('Completed', res.statusCode, duration+'ms');
	});
	next();
}

exports.ignore = /^\/(public|agent)/;