var api_v1 = require('../config.js').app.api_v1; // /api/v1
var User = require('../db/User.js'); // 用户业务实体
// from npm
var _ = require('underscore');
var bcrypt = require('bcrypt'); // https://github.com/ncb000gt/node.bcrypt.js/
var parse = require('co-body');
var thunkify = require('thunkify');

// 超级管理员
var amdin = {
  username: 'root',
  password: '$2a$10$Ru0xepK1Xm3VZoIrtSMl6exZ9JLRJdjft/roFLG8BYbtvqcl1IAWe' // ldap123)(*
};

// 验证用户名密码
module.exports.Authentication = function*(next) {
  try {
    // var body = yield parse.json(this);
    // _.pick
    // 1 匹配用户是否存在（密文）
    // 2 验证成功在this.session中记录用户,返回用户并且踢掉在线用户，验证失败直接返回用户
    // 3.更新当前用户cookie
    // yield this.session.del(cookie);
    console.log("通过身份验证...");
    yield next;
  } catch (err) {
    throw err; // 有可能是下游报错捕获的或者自己报错均抛给上游
  }
}

module.exports.route = function(app, route) {

  app.use(route.post(api_v1 + '/root', function*(user) {
    yield next;
  }));

  // 管理员添加一个用户
  app.use(route.post(api_v1 + '/users', function*(user) {
    yield next;
  }));


}
