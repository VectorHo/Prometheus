module.exports = {
  app: {
    port: 3000,
    api_v1: '/api/v1'
  },
  kue: {
    port: 3100,
    queue: {
      redis: {
        port: 6379,
        host: "127.0.0.1",
        db: 3
      }
    }
  },
  mongoose: {
    url: 'mongodb://127.0.0.1/Prometheus',
    options: {
      user: null,
      pass: null,
      server: {
        socketOptions: {
          keepAlive: 1 // 保持长连接
        }
      }
    }
  }
};
