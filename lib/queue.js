var kue = require('kue');
var config = require('./config.js'); // 全局配置

// #### 注册任务队列处理机制 #####
var jobs = kue.createQueue(config.kue.queue);
jobs.watchStuckJobs();
['online-nodejs'].forEach(function(each) {
  jobs.process(each, 5, require("./processor/" + each)); // parallel processing 5 jobs
});
if (process.env.NODE_ENV != 'production') kue.app.listen(config.kue.port);

module.exports.jobs = jobs;
module.exports.kue = kue;
