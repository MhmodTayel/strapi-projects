const amqplib = require('amqplib');
const pRetry = require('p-retry');
const { EventEmitter } = require('events');

module.exports = ({ strapi }) => {
  const {
    rabbitmqUrl,
    maxRetries,
    baseRetryInterval,
    queues,
    exchanges,
    prefetchNumber,
  } = strapi.config.get('plugin.strapi-amqplib-wrapper');

  /* eslint-disable no-param-reassign */
  strapi.plugin('strapi-amqplib-wrapper').instance = {
    connection: null,
    channel: null,
    retries: 0,
    connecting: false,
    emitter: new EventEmitter(),
    async connect() {
      this.connecting = true;
      this.connection = await pRetry(() => amqplib.connect(rabbitmqUrl), {
        retries: maxRetries,
        onFailedAttempt: ({ retriesLeft, message }) =>
          strapi.log.error(
            `Connection to rabbitMQ failed with err: ${message}. ${retriesLeft} retires left!`
          ),
        minTimeout: baseRetryInterval,
        maxTimeout: baseRetryInterval,
        factor: 1,
      });

      this.connecting = false;
      strapi.log.info('Connection to rabbitMq has been established');
      this.emitter.emit('amqp_connection_initialized');
      // Connection events
      this.connection.on('close', async () => {
        strapi.log.error('rabbitMQ connection closed!');
        this.connection = null;
        this.channel = null;
        await this.connect().catch(strapi.log.error);
      });

      this.connection.on('error', (err) => {
        strapi.log.error(`rabbitMQ connection error: ${err}`);
      });

      this.connection.on('blocked', (reason) => {
        strapi.log.error(`rabbitMQ connection blocked: ${reason}`);
      });
    },
    async createChannel() {
      if (this.connecting) {
        throw new Error('Connection to rabbitMQ is not ready!');
      }

      if (!this.connection) {
        try {
          await this.connect();
        } catch (err) {
          this.connecting = false;
          throw new Error(
            `Connection to rabbitMQ couldn't be established: ${err}!`
          );
        }
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel();

        await Promise.all([
          ...queues.map(async (q) => {
            await this.channel.assertQueue(q.name, q.options);
            return this.channel.bindQueue(q.name, q.bindExchange);
          }),
          ...exchanges.map((ex) =>
            this.channel.assertExchange(ex.name, ex.type, ex.options)
          ),
        ]);

        // Channel events
        this.channel.on('error', (err) => {
          strapi.log.error(err);
          this.channel = null;
        });

        this.channel.on('close', () => {
          strapi.log.error('rabbitMQ channel closed');
          this.channel = null;
        });
      }
      return this.channel;
    },
    async publish(ex, msg, rKey = '', opts = { persistent: true }) {
      if (!this.channel) await this.createChannel();
      return this.channel.publish(
        ex,
        rKey,
        Buffer.from(JSON.stringify(msg)),
        opts
      );
    },
    async sendToQueue(q, msg) {
      if (!this.channel) await this.createChannel();
      return this.channel.sendToQueue(q, Buffer.from(JSON.stringify(msg)));
    },
    async consume(q, cb) {
      if (!this.channel) await this.createChannel();
      const queue = queues.find(({ name }) => name === q);
      if (!queue) throw new Error(`Queue [${q}] doesn't exist`);
      await this.channel.assertQueue(queue.name, queue.options);
      this.channel.prefetch(prefetchNumber);
      this.channel.consume(queue.name, cb);
    },
  };

  strapi
    .plugin('strapi-amqplib-wrapper')
    .instance.createChannel()
    .catch(strapi.log.error);
};
