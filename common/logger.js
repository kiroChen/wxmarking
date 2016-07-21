var log4js = require('log4js');

log4js.configure({
	appenders: [
		{ 
			type: 'console',
			category: 'console'
		},{
			type: 'dateFile',
			filename: 'logs/index.log',
			category: 'dateFile'
		}        
	],
	replaceConsole: true        //让所有console输出到日志中，以[INFO] console代替console默认样式
});

var logger = log4js.getLogger('console');

logger.setLevel('INFO');

module.exports = logger;