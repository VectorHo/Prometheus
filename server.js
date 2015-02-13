var koa = require('koa');
var logger = require('koa-logger');
var mount = require('koa-mount');
var validate = require('koa-validate');
var json = require('koa-json');
var requestId = require('koa-request-id');
var csrf = require('koa-csrf');
var session = require('koa-session-redis2');
var serve = require('koa-static');
var compress = require('koa-compress');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var parse = require('co-body');
var route = require('koa-route');
var kue = require('kue');
var path = require('path');
var config = require('./lib/config.js'); // 全局配置

// #### 捕捉全局异常 ####
process.on('uncaughtException', function(err) {
  console.error("全局异常捕获，保证程序不会终止:\n\t%s", err);
  console.trace(err.stack);
});

// #### 注册任务队列处理机制 #####
var jobs = kue.createQueue(config.kue.queue);
jobs.watchStuckJobs();
['online-nodejs'].forEach(function(each) {
  jobs.process(each, 5, require("./lib/processor/" + each)); // parallel processing 5 jobs
});
if (process.env.NODE_ENV != 'production') kue.app.listen(config.kue.port);

// ### create koa ###
var app = module.exports = koa();
app.name = config.app.name;
app.proxy = config.app.proxy; // 是否允许前置代理，eg：nginx
// middleware
app.use(requestId()); // 为request生成uuid -> this.id(https://github.com/segmentio/koa-request-id)
app.use(compress()); // Compress
app.use(json()); // Default to being disabled (useful in ENV = production), but togglable via the query-string parameter
app.use(logger());
app.use(validate()); // validator
app.use(conditional()); // etag works together with conditional-get
app.use(etag());
// 锦上添花
app.use(function*(next) {
  yield next;
  this.set('request-Id', this.id);
  this.set('X-Powered-By', 'Prometheus');
  this.set('Server', 'koa');
  this.set('X-Pretty-Print', true);
});
app.use(serve(path.resolve(__dirname, 'assets')));

// session support
app.keys = [config.app.key];
app.use(session({
  store: {
    host: process.env.SESSION_PORT_6379_TCP_ADDR || config.redis.url,
    port: process.env.SESSION_PORT_6379_TCP_PORT || config.redis.port,
    ttl: config.redis.ttl
  }
}));

// custom 500：捕获下游 throw error
function errHandle(that, err) {
  console.trace(err.stack); // 有些错误没有
  console.log('%s internal server error...', that.status);
  that.status = 500;
  if (that.path.indexOf('/api') != -1) {
    err.url = that.protocol.concat('://', that.host, that.originalUrl);
    that.throw(err); // 会促发app.on('err')事件
  } else {
    that.redirect('/500.html');
  }
}
app.use(function*(next) {
  try {
    yield next;
  } catch (err) {
    errHandle(this, err);
  }
});
// Authentication 身份验证通过后能在this.session.user
app.use(require('./lib/router/users').Authentication);
// persistence logs，放置身份验证后面目的就是只记录登录后的日志
app.use(require('./lib/router/logs').log);

// #### RESTFUL路由：处理业务 ####
app.use(route.get('/api', function*() {
  this.redirect(config.app.api_v1);
}));
app.use(route.get(config.app.api_v1, function*() {
  this.body = {
    meta: 'TODO meta、url、link ETC.'
  };
}));
require('./lib/router/users').route(app, route);
require('./lib/router/logs').route(app, route);
require('./lib/router/servers')(app, route);
require('./lib/router/projects')(app, route);
require('./lib/router/jobs')(app, route);

// ##### custom 404 #####
app.use(function*(next) {
  yield next;
  console.log('%s Not Found...', this.status);
  if (404 != this.status) return;
  this.status = 404;
  this.session.level = 'yellow';
  if (this.path.indexOf('/api') != -1) {
    this.body = {message: 'Page Not Found'};
  } else {
    this.redirect('/404.html');
  }
});

// ##### app error handler #####
app.on('error', function(err, ctx) {
  if (process.env.NODE_ENV != 'test') { // output to stderr
    // console.log(ctx.toJSON());
    console.error('sent error [ %s ] to the cloud\n\t', err);
    console.trace(err.stack);
  }
});
// 挂载app上下文：prometheus
app.use(mount('/' + config.app.name, app));

if (!module.parent) {
  app.listen(process.env.PORT || config.app.port);
  console.log('Prometheus Listen on port %s', config.app.port);
  console.log('kue Listen on port %s', config.kue.port);
}
