var express = require('express');
var router = express.Router();
var markingController = require('../controllers/markingController');

router.get('/201604',                   markingController.avtiveties201604.get);//201604活动页面
router.post('/201604/shareCallback',    markingController.avtiveties201604.shareCallback);//分享活动页面后的动作
router.post('/201604/lottery',          markingController.avtiveties201604.lottery);//抽奖动作

module.exports = router;