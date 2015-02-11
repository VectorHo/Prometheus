var mongoose = require("mongoose");
var config = require('../config');

exports.mongoose = mongoose;

// start connect...
mongoose.connect(config.mongoose.url, config.mongoose.options);

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
  if (count <= 5)
    setTimeout(connect, 10000);
  else
    process.exit(1);
});
