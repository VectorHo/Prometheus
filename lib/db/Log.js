/**
 *  logs 业务实体：日志
 */
var mongodb = require("./mongodb.js");


logSchema = new mongodb.mongoose.Schema ({
	type: { type: String, enum: [ "user", "project", "job"]},
	identifier: String,
	action: { type: String, enum: [ "GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE"]},
	source: String, // req.host
	url: String, // request.originalUrl
	project: String, // 项目名称
	user: String, // 用户名称
	job: String, // 任务名称
	level: { type: String, enum: [ "red", "yellow", "green"]},
	comment: String,
	time: { type: Date, default: Date.now},
});

// compile logs model
var logModel = mongodb.mongoose.model('logs', logSchema);

var logDAO = function(){}

logDAO.prototype.save = function(obj, callback){
  var instance = new logModel(obj);
  instance.save(callback);
};

// [find description]   查询
// @param  {[Object]}   conditions
// @param  {[Object]}   fields      optional fields to select
// @param  {[string]}   options     optional
// @param  {Function}   callback    [description]
// @return {[type]}                 [description]
logDAO.prototype.find = function(conditions, fields, options, callback){
	logModel.find.apply(logModel, arguments);
}

module.exports = new logDAO();
