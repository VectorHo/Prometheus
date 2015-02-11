var api_v1 = require('../config.js').app.api_v1;

module.exports = function(app, route) {

  app.use(route.get(api_v1 + '/logs', function*() {

  }));
}
