/* eslint-disable max-len */
import firebase from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || '{}');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const fcm = firebase.messaging();

type PushNotification = {
  topic?: string;
  condition?: string;
  tokens?: string[];
  payload: object;
  options: object;
};

export default () => ({
  subscribe: async (token, topics) =>
    Promise.all(topics.map((topic) => fcm.subscribeToTopic(token, topic))),
  unsubscribe: async (token, topics) =>
    Promise.all(topics.map((topic) => fcm.unsubscribeFromTopic(token, topic))),
  publish: async (notification: PushNotification) => {
    strapi
      .plugin('strapi-amqplib-wrapper')
      .instance.publish('x-notification', {
        means: 'push',
        msgConfig: notification,
      })
      .catch((err) => {
        strapi.log.error(
          `Couldn't publish push notification due to error with rabbitMQ connection: ${err}`
        );
      });
  },
});
