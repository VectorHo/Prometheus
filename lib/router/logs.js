var api_v1 = require('../config.js').app.api_v1;
var Log = require('../db/Log.js');
var parse = require('co-body');


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
    if(log.comment.status && log.comment.status === 404) return
    console.log('开始记录日志: %s', log.identifier);
    Log.save(log);
  }
}

module.exports.route = function(app, route) {

  // 按颜色值进行搜索
  app.use(route.post(api_v1 + '/search/colour', function*() {
    var body = yield parse(this);
    console.log("color: " + body);
    
    // this.body = body;
    // Log.find({level: })
  }));

  
}
