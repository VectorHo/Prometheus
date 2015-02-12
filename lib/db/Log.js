/**
 *  logs 业务实体：日志
 */
var mongodb = require("./mongodb.js");


logSchema = new mongodb.mongoose.Schema ({
	type: { type: String, enum: [ "user", "job"]},
	identifier: String,
	action: { type: String, enum: [ "GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE"]},
	source: String,
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

module.exports = new logDAO()







