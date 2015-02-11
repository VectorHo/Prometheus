var mongoose = require("mongoose");

exports.mongoose = mongoose;

/**
 * [connect description]  Connect to mongodb
 *  @return {[type]} [description]
 */
function connect() {
  var options = {
    user: null,
    pass: null,
    server: {
      socketOptions: {
        keepAlive: 1 // 保持长连接
      }
    }
  };
  mongoose.connect('mongodb://127.0.0.1/Prometheus', options);
}

// start connect...
connect();

mongoose.connection.on("open", function() {
  console.info("mongodb is opened...");
});

// Error handler
mongoose.connection.on("error", function(err) {
  console.error("mongodb error: %s", err);
});


var count = 0;
// Reconnect when closed
mongoose.connection.on("disconnected", function() {
  console.warn("mongodb already disconnected, reconnection %s times...", count);
  count++;
  if(count <= 5)
    setTimeout(connect, 10000);
  else
    process.exit(1);
});
