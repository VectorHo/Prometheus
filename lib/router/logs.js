var api_v1 = require('../config.js').app.api_v1;
var Log = require('../db/Log.js');
var thunkify = require('thunkify');
var qs = require('querystring');
var _ = require('underscore');

// 记录日志中间件：所有请求响应时都会经过此中间件下游
module.exports.log = function*(next) {
  try {
    var log = {
      identifier: this.id,
      type: 'user',
      action: this.method,
      source: this.host,
      url: this.originalUrl,
      user: this.session.user,
      level: 'green',
      comment: this.toJSON()
    };
    yield next;
  } catch (err) {
    log.level = 'red';
    log.comment = err;
    throw err;
  } finally {
    // 暂时把对这些资源的操作记录在session，只是为了记录logs
    if (this.session.log_type) {
      log.type = this.session.log_type;
      delete this.session.log_type;
    }
    if (this.session.project) {
      log.project = this.session.project;
      delete this.session.project;
    }
    if (this.session.job) {
      log.job = this.session.job;
      delete this.session.job;
    }
    if (this.session.level) {
      log.level = this.session.level;
      delete this.session.level
    }
    // 如果在finally方法里直接返回的话err对象就传不到上游去
    // if(log.comment.status && log.comment.status === 404
    // || log.comment.response.status && log.comment.response.status === 404) return
    console.log('开始记录日志: %s', log.identifier);
    console.log(log);
    Log.save(log);
  }
}

module.exports.route = function(app, route) {
  // 搜索日志
  app.use(route.get(api_v1 + '/logs', function*() {
    var conditions = qs.parse(this.querystring);

    // 检测输入的是否只为："level", "action", "type", "user", "project", "beginTime", "endTime"，如果不是，则报错
    var keyDifference = _.difference(_.keys(conditions),["level", "action", "type", "user", "project", "beginTime", "endTime"]);
    if(0 != keyDifference.length){
      this.status = 403;
      this.body = {"message": "Only the following options:level, action, type, user, project, beginTime, endTime"};
      return;
    }
    
    // 检测level, action, type 等是否符合要求
    this.checkQuery("level").empty().in(["red", "yellow", "green"], "Only the following options:red, yellow, green.");
    this.checkQuery("action").empty().in(["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE"], "Only the following options:GET, HEAD, POST, PUT, DELETE, OPTIONS, TRACE.");
    this.checkQuery("type").empty().in(["user", "project", "job"], "Only the following options:user, project, job.");
    if(this.errors){
      this.body = this.errors;
      return;
    }
    
    // 是否存在时间限制的搜索
    var timeLimit = {};
    if( _.has(conditions, "beginTime") ){
      timeLimit = {"$gte": new Date(conditions["beginTime"])};
    }
    if( _.has(conditions, "endTime") ){
      timeLimit = _.extend(timeLimit, {"$lte": new Date(conditions["endTime"])});
    }
    
    timeLimit = {time: timeLimit};
    
    // 将"beginTime", "endTime"剔除出去
    conditions = _.omit(conditions, "beginTime", "endTime");

    // 将timeLimit 添加到 conditions 中
    conditions = _.extend(conditions, timeLimit);

    // 进行搜索
    var levelSearch = thunkify(Log.find);
    try {
      docs = yield levelSearch(conditions);
      this.body = docs;
    } catch (err) {
      this.body = err;
    }
  }));
}
