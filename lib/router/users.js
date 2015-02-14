var api_v1 = require('../config.js').app.api_v1; // /api/v1
var User = require('../db/User.js'); // 用户业务实体
var _ = require('underscore');
var bcrypt = require('bcrypt'); // https://github.com/ncb000gt/node.bcrypt.js/
var thunkify = require('thunkify');

// 超级管理员
var amdin = {
  username: 'root',
  password: '$2a$10$Ru0xepK1Xm3VZoIrtSMl6exZ9JLRJdjft/roFLG8BYbtvqcl1IAWe' // ldap123)(*
};

// 验证用户名密码
module.exports.Authentication = function*(next) {
  try {
    if (!this.session.user && this.path == api_v1 + '/login' && this.method == 'POST') { // 不拦截登录操作
      console.log("@_@ 开始身份验证...");
      return yield next;
    } else if(this.session.user && this.path == api_v1 + '/login' && this.method == 'POST') {// 拦截重复登录操作
      console.warn("T_T 用户重复登录...");
      this.status = 409;
      return this.body = {message: 'Please don\'t repeat authorization.'};
    }
    if (!this.session.user) { // 拦截未登录操作
      console.warn("-_- 用户未登录...");
      this.status = 401;
      return this.body = {message: 'unauthorized.'};
    } else { // 不拦截登录操作
      console.log("^_^ 通过身份验证...");
      yield next;
    }
  } catch (err) {
    throw err; // 有可能是下游报错捕获的或者自己报错均抛给上游
  }
}

module.exports.route = function(app, route) {

  // 用户登入
  app.use(route.post(api_v1 + '/login', function*() {
    // root or user

    // var body = this.request.body;
    // var user = _.pick(body, 'username', 'password');
    // this.checkBody('username');
    // if(_.isEmpty(body) && !user) {
    //   this.status = 403;
    //   return this.body = {message: ''};
    // }
    // 1 匹配用户是否存在（密文）
    // 2 验证成功在this.session中记录用户,返回用户并且踢掉在线用户，验证失败直接返回用户
    // 3.更新当前用户cookie
    // yield this.session.del(cookie);
  }));

  // 修改root密码
  app.use(route.post(api_v1 + '/password', function*(user) {
    // var body = yield parse.json(this);

  }));

  // 管理员添加一个用户
  app.use(route.post(api_v1 + '/users', function*(user) {

  }));


}
