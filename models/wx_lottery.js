var mongoose = require('mongoose');
var BaseModel = require("./base_model");

var wxlotterySchema = new mongoose.Schema({
    wxuserid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wx_user'
    },
	openid: String,
	type: String,		//redPack_1:一元红包  watch:手表奖品  nothing:没中奖
	isReceived: {
		type: Boolean,		//是否领取
		default: false		
	},
    activites: {
        type: String,
        default: '201604'
    },
    receiveTime: Date
});

wxlotterySchema.plugin(BaseModel);
wxlotterySchema.index({ openid: -1 });


mongoose.model('wx_lottery', wxlotterySchema);