var api_v1 = require('../config.js').app.api_v1;


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
    // TODO save
    console.log(log);
  }
}

module.exports.route = function(app, route) {

  app.use(route.get(api_v1 + '/logs', function*() {

  }));
}
