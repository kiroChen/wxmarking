var mongoose = require('mongoose');
var BaseModel = require("./base_model");

var wxuserSchema = new mongoose.Schema({
	subscribe: Number,
	openid: String,
	nickname: String,
	sex: Number,
	language: String,
	city: String,
	province: String,
	country: String,
	headimgurl: String,
	subscribe_time: Number,
    mark_info: {
        type: Object,
        default: new Object({
            active201604: {
                total: 1
            }
        })
    }
});

wxuserSchema.plugin(BaseModel);
wxuserSchema.index({ openid: -1 },{ unique: true });


mongoose.model('wx_user', wxuserSchema);