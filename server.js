var koa = require('koa');
var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-body');
var path = require('path');


var app = module.exports = koa();

app.use(logger());

// ##### custom 404 #####
app.use(function*(next) {
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});

app.use(serve(path.resolve(__dirname, 'assets')));


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
