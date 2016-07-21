var express = require('express');
var router = express.Router();
var commonController = require('../controllers/commonController');

router.get('/wxConfig',         commonController.getWxConfig);      //jssdk wxconfig获取
router.get('/wxRedirect',       commonController.wxRedirect);       //微信jssdk 用户授权


module.exports = router;