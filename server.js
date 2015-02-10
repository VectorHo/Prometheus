var koa = require('koa');
var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-body');
var path = require('path');
var kue = require('kue');

// #### 捕捉全局异常 ####
process.on('uncaughtException', function(err) {
  console.error("全局异常捕获，保证程序不会终止: %s", err);
  console.trace(err.stack);
});

// #### 注册任务队列处理机制 #####
var jobs = kue.createQueue({
  redis: {
    port: 6379,
    host: "127.0.0.1",
    db: 3
  }
});
jobs.watchStuckJobs();
['online-nodejs'].forEach(function(each) {
  jobs.process(each, 5, require("./lib/processor/" + each)); // parallel processing 5 jobs
});
if(process.env.NODE_ENV != 'production') kue.app.listen(3100);


// ### create koa ###
var app = module.exports = koa();

app.use(serve(path.resolve(__dirname, 'assets')));
app.use(logger());


// ##### custom 404 #####
app.use(function*(next) {
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});

// error handler
app.on('error', function(err) {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.trace(err.stack);
  }
});

if (!module.parent) {
  app.listen(3000);
  console.log('Prometheus Listen on port 3000');
}
