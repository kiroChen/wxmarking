//var wxconfig = require('../config/index').wx;
var wxhelper = require('../common/wxhelper');

//jssdk wxconfig获取
exports.getWxConfig = function(req, res, next) {
	wxhelper.getWxConfig(req.query.url, function(err, config) {
		if(err) {
			return next(err);
		}
		return res.json(config);
	});
}

//授权跳转
// /common/wxRedirect
exports.wxRedirect = function(req, res, next) {
	var url = req.query.url;
	var type = req.query.type;
	var redirectUrl = wxhelper.getAuthorizeURL(url,'',type);
	res.redirect(redirectUrl);
}