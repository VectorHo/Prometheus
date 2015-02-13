var api_v1 = require('../config.js').app.api_v1;
var Log = require('../db/Log.js');
// from npm
var parse = require('co-body');
var thunkify = require('thunkify');


// 记录日志中间件：所有请求响应时都会经过此中间件下游
module.exports.log = function*(next) {
  try {
    var log = {
      identifier: this.id,
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
    if (this.session.project) {
      log.project = this.session.project;
      this.session.project = null;
    }
    if (this.session.job) {
      log.job = this.session.job;
      this.session.job = null;
    }
    if (this.session.level) {
      log.level = this.session.level;
      this.session.level = null;
    }
    // 如果在finally方法里直接返回的话err对象就传不到上游去
    // if(log.comment.status && log.comment.status === 404 || log.comment.response.status && log.comment.response.status === 404) return
    console.log('开始记录日志: %s', log.identifier);
    console.log(log);
    Log.save(log);
  }
}

module.exports.route = function(app, route) {
  // 搜索日志
  app.use(route.post(api_v1 + '/search', function*() {
    var body = yield parse.json(this);
    var levelSearch = thunkify(Log.find);
    try{
      docs = yield levelSearch(body);
      this.body = docs;
    }catch(err){
      this.err = err;
    }
  }));

}
