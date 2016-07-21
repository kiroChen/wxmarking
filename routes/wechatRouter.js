var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var wxconfig = require('../config/index').wx;
var wxhelper = require('../common/wxhelper');
var WXLottery = require('../models/index').wx_lottery;
var async = require('async');

//微信公众平台自动回复
router.use('/', wechat(wxconfig.token, wechat
.event(function(message, req, res, next){
	if(message.Event == 'subscribe') {
		//关注事件
        var openid = message.FromUserName;
        async.waterfall([
            function(cb) {
                WXLottery.find({
                    openid: openid,
                    type: 'redPack_1',
                    isReceived: false,
                    activites: '201604'
                }, cb);
            },
            function(lotteryArr, cb) {
                if(lotteryArr.length == 0) return cb(null);
                async.each(lotteryArr, function(lottery, cb1) {
                    wxhelper.sendRedPack({
                        re_openid: openid,
                        mch_billno: lottery._id,
                        wishing: '踏青新装备'
                    }, cb1);
                }, cb);
            },
            function(cb) {
                WXLottery.update({
                    openid: openid,
                    type: 'redPack_1',
                    isReceived: false,
                    activites: '201604'
                }, {
                    $set: {
                        isReceived: true,
                        receiveTime: new Date()
                    }
                }, {
                    multi: true
                }, cb);
            }
        ], function(err) {
            if(err) console.error(err);
        });
		res.reply('谢谢关注');
	} else if(message.Event == 'CLICK') {
		//自定义菜单按钮事件
		if(message.EventKey === 'BYT-PLAYGAME') {
			res.reply('请等待下一次活动哦！');
		} else if(message.EventKey === 'BYT-CUSTOMER') {
			res.reply('亲，您好！您有什么需要咨询的，可以在我们公众号留言，我们的客服会在第一时间回复您的！');
		} else {
			res.reply('请稍候，客服正在处理中。');
		}
	} else {
		res.reply('请稍候，客服正在处理中。');
	}
}).text(function(message, req, res, next) {
	if(message.Content == 'test') {
		res.reply('成功');
	} else {
		res.reply({
			type: 'transfer_customer_service'
		});
	}
}).image(function(message, req, res, next) {
	res.reply({
		type: 'transfer_customer_service'
	});
}).voice(function(message, req, res, next) {
	res.reply({
		type: 'transfer_customer_service'
	});
}).video(function(message, req, res, next) {
	res.reply({
		type: 'transfer_customer_service'
	});
}).link(function(message, req, res, next) {
	res.reply({
		type: 'transfer_customer_service'
	});
})));

module.exports = router;