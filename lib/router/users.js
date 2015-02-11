var api_v1 = require('../config.js').app.api_v1;
var User = require('../db/User.js'); // 用户业务实体

module.exports = function(app, route) {

  app.use(route.get(api_v1 + '/users', function*() {

  }));
}
