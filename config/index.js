var fs = require('fs');
var path = require('path');

var config = {
	wx: {
		appid: 'appid',						//appid
		appsecret:'appsecret',		//appsecret
		mch_id: 'mch_id',								//微信商店号
		partner_key:'partner_key',		//微信商户平台API密钥
		token: 'token',
		encodingAESKey: 'encodingAESKey',
		pfx: fs.readFileSync(path.join(__dirname,'apiclient_cert.p12'))		//apiclient_cert需要自行下载
	},
	db: 'mongodb://localhost/db_watch'
}

module.exports = config;