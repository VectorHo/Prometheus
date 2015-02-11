/**
 *  user 业务实体：用户
 */
var mongodb = require("./mongodb.js");

var userSchema = new mongodb.mongoose.Schema({
  type: {type: String, enum: ['general','admin']},
  account: {type: String, unique: true, required: true},
  password: {type: String, required: true, min: 6},
  name: {type: String, required: true},
  subjection: String, // 隶属团队
  telephone: {type: Number, min: 11, max: 11},
  email: String,
  cookie: String, // 当前在线用户cookie（踢用户标识）
  online: {type: Boolean, default: false}, // 是否上线
  online_time: { type: Date, default: Date.now}, // 上线时间
  create_time: { type: Date, default: Date.now}, // 上线时间
});
// compile user model
var userModel = mongodb.mongoose.model('users', userSchema);

module.exports = userModel;
