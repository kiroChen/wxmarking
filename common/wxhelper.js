var wxconfig = require('../config/index').wx;
var WechatAPI = require('wechat-api');
var api = new WechatAPI(wxconfig.appid, wxconfig.appsecret);
var querystring = require('querystring');
var request = require('superagent');
var wechatMenu = require('../config/wechatMenu');
var RedPack = require('weixin-redpack').Redpack;
var moment = require('moment');
var redpack = RedPack({
	mch_id: wxconfig.mch_id,
	partner_key: wxconfig.partner_key,
	wxappid: wxconfig.appid,
	pfx: wxconfig.pfx
});

//创建自定义菜单
api.createMenu(wechatMenu, function(err, data) {
	if(err) console.error(err);
	else console.log(data);
});

//获取access_token
exports.getAccessToken = function(callback){
	api.getLatestToken(callback);
};

//jssdk wxconfig获取
exports.getWxConfig = function(url, callback) {
	var param = {
		debug: false,
		url: url,
		jsApiList: ['checkJsApi', 'onMenuShareTimeline','onMenuShareAppMessage','scanQRCode','chooseImage','uploadImage']
	}
	api.getJsConfig(param, callback);
}

//获取微信用户信息
exports.getWxUser = function(openid, callback){
	api.getUser({
		openid: openid,
		lang: 'zh_CN'
	},callback);
}

//获取跳转
exports.getAuthorizeURL = function(redirect, state, scope) {
	var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
	var info = {
		appid: wxconfig.appid,
		redirect_uri: redirect,
		response_type: 'code',
		scope: scope || 'snsapi_base',
		state: state || ''
	};
	return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}

//获取网页授权AccessToken
exports.getJsAccessToken = function(code, callback) {
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
	request
		.get(url)
		.query({
			appid: wxconfig.appid,
			secret: wxconfig.appsecret,
			code: code,
			grant_type: 'authorization_code'
		})
		.end(function(err, result) {
            if(err) return callback(err);
            var obj = JSON.parse(result.text);
            callback(null, obj);
        });
}

//根据code获取wxUser
exports.getWxUserByCode = function(code, callback) {
	var _this = this;
	_this.getJsAccessToken(code, function(err, result) {
		if(err) return callback(err);
		_this.getWxUser(result.openid, function(err, wxUser) {
            if(err) return callback(err);
            callback(err, wxUser);
        });
	});
}


//发送红包
//基础格式:{re_openid: openid,mch_billno: _id, client_ip: client_ip}
exports.sendRedPack = function(redPackInfo, callback) {
	redPackInfo.send_name = redPackInfo.send_name || 'send_name';
	redPackInfo.wishing = redPackInfo.wishing || 'wishing';
	redPackInfo.total_amount = redPackInfo.total_amount || 100;     //单位为分
	redPackInfo.total_amount = redPackInfo.total_amount >= 100 ? redPackInfo.total_amount: 100;
	redPackInfo.total_num = 1;
	redPackInfo.client_ip = redPackInfo.client_ip || '192.168.1.10';
	redPackInfo.nick_name = redPackInfo.nick_name || 'nick_name';
	redPackInfo.act_name = redPackInfo.act_name || 'act_name';
	redPackInfo.remark = redPackInfo.remark || 'remark';
	redPackInfo.mch_billno = wxconfig.mch_id + moment().format('YYYYmmDD') + redPackInfo.mch_billno.toString().substr(-10,10);
	redpack.send(redPackInfo, callback);
}