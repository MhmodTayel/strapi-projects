module.exports = {
  default: {
    rabbitmqUrl: 'amqp://guest:guest@rabbitmq:5672',
    maxRetries: 6,
    baseRetryInterval: 60000,
    queues: [],
    exchanges: [],
  },
  validator() {},
};
