var express = require('express');
var router = express.Router();
var markingRouter = require('./markingRouter');
var commonRouter = require('./commonRouter');
var wechatRouter = require('./wechatRouter');

router.use('/common',   commonRouter);      //公用的接口
router.use('/marking',  markingRouter);     //针对市场做的活动页面，h5
router.use('/wechat',   wechatRouter);      //微信机器人，针对用户在微信公众平台上做的操作的响应

module.exports = router;