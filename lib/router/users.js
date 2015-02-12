var api_v1 = require('../config.js').app.api_v1;
var redis_option = require('../config.js').redis;
var User = require('../db/User.js'); // 用户业务实体
var _ = require('underscore');
var bcrypt = require('bcrypt'); // https://github.com/ncb000gt/node.bcrypt.js/
var redis_client = require('redis').createClient(redis_option.port, redis_option.url, {});

// 验证用户名密码
module.exports.Authentication = function*(next) {
  try {
    // 1 匹配用户是否存在（密文）
    // 2 验证成功在this.session中记录用户,返回用户并且踢掉在线用户，验证失败直接返回用户
    // 3.更新当前用户cookie
    yield next;
  } catch (err) {
    throw err; // 有可能是下游报错捕获的或者自己报错均抛给上游
  }
}

module.exports.route = function(app, route) {

  // 管理员添加一个用户
  app.use(route.post(api_v1 + '/users', function*(user) {
    if ('POST' != this.method) return yield next;

  }));
}
