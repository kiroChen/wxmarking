var wxhelper = require('../common/wxhelper');
var async = require('async');
var WXUser = require('../models/index').wx_user;
var WXLottery = require('../models/index').wx_lottery;

//针对2016年04月做的微信市场运营页面
exports.avtiveties201604 = {
	get: function(req, res, next) {
        //return res.render('marking/201604');
        var redirectUrl = "/common/wxRedirect?url=http://wx.huukuu.cn/marking/201604&type=snsapi_userinfo";
        if(!req.query.code) return res.redirect(redirectUrl);
        async.waterfall([
            function(cb) {
                wxhelper.getWxUserByCode(req.query.code, function(err, wxUser) {
                    if(err){
                        return res.redirect(redirectUrl);
                    }
                    return cb(null, wxUser);
                });
            }, 
            function(wxUser, cb) {
                //30min失效
                req.session.openid = wxUser.openid;
                
                WXUser.findOne({
                    openid: wxUser.openid
                }, function(err, wxUserDB) {
                    if(err) return cb(err);
                    if(wxUserDB) {
                        wxUserDB.update({
                            $set: wxUser
                        }, function(err) {
                            return cb(err, wxUser);
                        });
                    } else {
                        var newWxUser = new WXUser(wxUser);
                        newWxUser.save(function(err) {
                            return cb(err, wxUser);
                        });
                    }
                });
            },
            /*
            function(wxUser, cb) {
                //用户获奖情况
                WXLottery.find({
                    activites: '201604',
                    openid: wxUser.openid
                }, {
                    isReceived: 1,
                    type: 1,
                    createdAt:1,
                    _id: 0
                }, function(err, lotRecords) {
                    if(err) return cb(err);
                    return cb(null, {
                        wxUser: wxUser, 
                        lotRecords: lotRecords
                    });
                })
            },
            */
            function(wxUser, cb) {
                //获奖名单（50名）
                WXLottery.find({
                    activites: '201604',
                    type: {
                        $in: ['redPack_1','watch']
                    }
                })
                .populate({
                    path: 'wxuserid',
                    match : {
                        nickname: {
                            $exists: true
                        }
                    },
                    select: '-_id nickname sex headimgurl'
                })
                .select('-_id -__v ')
                .limit(100)
                .sort('-createdAt')
                .exec(function(err, lotUsers) {
                    if(err) return cb(err);
                    //result.lotUsers = lotUsers;
                    cb(null, {
                        wxUser: wxUser,
                        lotUsers: lotUsers    
                    });
                });
            }
        ], function(err, result) {
            if(err) return next(err);
            res.render('marking/201604',result);
        });
	},
	shareCallback: function(req, res, next) {
        console.log(req.session.openid);
		if(!req.session.openid) {
            return res.json({
                isSuccess: false,
                msg: 'unauthorized'
            });
        }
        async.waterfall([
            function(cb) {
                WXUser.findOne ({
                    openid: req.session.openid
                }, function (err, wxUser) {
                    if(err) return cb(err);
                    var total = (wxUser && wxUser.mark_info && wxUser.mark_info.active201604 && wxUser.mark_info.active201604.total) || 1;
                    if(total >= 2) {
                        return res.json({
                            isSuccess: false,
                            msg: '超过最大可抽奖次数'
                        });
                    }
                    return cb(null);
                });
            },
            function(cb) {
                WXUser.findOneAndUpdate({
                    openid: req.session.openid
                }, {
                    $inc: {
                        "mark_info.active201604.total" : 1
                    }
                }, cb);
            }
        ], function(err, wxUser) {
            if(err) return next(err);
            return res.json({
                isSuccess: true,
                msg: '增加了抽奖次数'
            });
        });
	},
	lottery: function(req, res, next) {
		//unauthorized
        if(!req.session.openid) {
            return res.json({
                isSuccess: false,
                msg: 'unauthorized'
            });
        }
        async.waterfall([
            function(cb) {
                WXUser.findOne ({
                    openid: req.session.openid
                }, function (err, wxUser) {
                    if(err) return cb(err);
                    var total = (wxUser && wxUser.mark_info && wxUser.mark_info.active201604 && wxUser.mark_info.active201604.total) || 1;
                    var current = (wxUser && wxUser.mark_info && wxUser.mark_info.active201604 && wxUser.mark_info.active201604.current) || 0;
                    if( current >= total ) {
                        return res.json({
                            isSuccess: false,
                            msg: '每人只能抽一次哦，转发朋友圈可再抽一次，最多两次哦。'
                        });
                    }
                    return cb(null, wxUser);
                });
            }, 
            function(wxUser, cb) {
                //查找已经抽到的奖项
                WXLottery.aggregate([{
                    $match: {
                        activites: '201604',
                    } 
                }, {
                    $group : {
                        _id : "$type", 
                        count : {
                            $sum : 1
                        }
                    }
                }],function (err, data) {
                    if(err) return cb(err);
                    
                    var effectRecord = {};
                    data.forEach(function (dt) {
                        effectRecord[dt._id] = dt.count;
                    });
                    return cb(null, wxUser, effectRecord);
                });
            },
            function(wxUser, effectRecord, cb) {
                var redPackCount = effectRecord.redPack_1 || 0;
			    var watchCount = effectRecord.watch || 0;
                
                var random = Math.ceil(Math.random() * 100);
                var lotRecord = {};
                if(random <= 49 && redPackCount < 5000) {
                    lotRecord = new WXLottery({
                        wxuserid: wxUser._id,
                        openid: req.session.openid,
                        type: "redPack_1"
                    });
                } else if(random == 50 && watchCount < 10) {
                    lotRecord = new WXLottery({
                        wxuserid: wxUser._id,
                        openid: req.session.openid,
                        type: "watch"
                    });
                } else {
                    lotRecord = new WXLottery({
                        wxuserid: wxUser._id,
                        openid: req.session.openid,
                        type: "nothing",
                        isReceived: true,
                        receiveTime: new Date()
                    });
                }
                if(lotRecord.type == 'redPack_1' && wxUser.subscribe === 1) {
                    wxhelper.sendRedPack({
                        re_openid: req.session.openid,
                        mch_billno: lotRecord._id,
                        wishing: '踏青新装备'
                    }, function(err, result) {
                        if(!err) {
                            lotRecord.isReceived = true;
                            lotRecord.receiveTime = new Date();
                            lotRecord.save();
                            return cb(null, lotRecord);
                        }
                    });
                } else {
                    lotRecord.save();
                    return cb(null, lotRecord);
                }
            },
            function(lotRecord, cb) {
                WXUser.findOneAndUpdate({
                    openid: req.session.openid
                }, {
                    $inc: {
                        "mark_info.active201604.current" : 1
                    }
                }, function(err) {
                    return cb(err, lotRecord);
                });
            }
        ], function(err, lotRecord) {
            if(err) return next(err);
            res.json({
                isSuccess: true,
                lottery: lotRecord || {}
            });
        });
	}
}