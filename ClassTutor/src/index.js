'use strict';
const SocketIo = require('../utils/socket-io-connection');
const auditLog = require('./boot/auditLog');
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {

    //#region socket.io config
    strapi.socketio = SocketIo.setupConnection(strapi);
    //#endregion

    auditLog(strapi);
    }
};
