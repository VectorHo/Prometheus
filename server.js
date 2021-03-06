var koa = require('koa');
var logger = require('koa-logger');
var mount = require('koa-mount');
var requestId = require('koa-request-id');
var serve = require('koa-static');
var compress = require('koa-compress');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var parse = require('co-body');
var route = require('koa-route');
var kue = require('kue');
var path = require('path');
var config = require('./lib/config.js');// 全局配置

// #### 捕捉全局异常 ####
process.on('uncaughtException', function(err) {
  console.error("全局异常捕获，保证程序不会终止: %s", err);
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
app.use(requestId()); // 为request生成uuid -> this.id(https://github.com/segmentio/koa-request-id)
app.use(compress()); // Compress
app.use(logger());
app.use(conditional()); // etag works together with conditional-get
app.use(etag());
// 锦上添花
app.use(function*(next) {
  yield next;
  this.set('X-Powered-By', 'Prometheus');
  this.set('Server', 'koa');
  this.set('X-Pretty-Print', true);
});
// TODO auth

app.use(serve(path.resolve(__dirname, 'assets')));

// #### RESTFUL路由：处理业务 ####
app.use(route.get('/', function*() {
  this.redirect(config.app.api_v1);
}));
app.use(route.get(config.app.api_v1, function*() {
  this.body = {
    meta: 'TODO meta、url、link ETC.'
  };
}));
require('./lib/router/users')(app, route);
require('./lib/router/logs')(app, route);
require('./lib/router/servers')(app, route);
require('./lib/router/projects')(app, route);
require('./lib/router/jobs')(app, route);

// ##### custom 404 #####
app.use(function*(next) {
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});

// ##### error handler #####
app.on('error', function(err) {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
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
