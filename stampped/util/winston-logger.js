/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
const LEVEL = Symbol.for('level');

const { createLogger, format, transports } = require("winston");
require('winston-daily-rotate-file');

var error_transport = new transports.DailyRotateFile({
   level: 'error',
   format: filterOnly('error'),
   filename: 'logs/error/error-%DATE%.json',
   datePattern: 'YYYY-MM-DD-HH',
   zippedArchive: false,
   maxSize: '20m',
   maxFiles: '14d'
});

var info_transport = new transports.DailyRotateFile({
   level: 'info',
   format: filterOnly('info'),
   filename: 'logs/info/error-%DATE%.json',
   datePattern: 'YYYY-MM-DD-HH',
   zippedArchive: false,
   maxSize: '20m',
   maxFiles: '14d'
});

var debug_transport = new transports.DailyRotateFile({
   level: 'debug',
   format: filterOnly('debug'),
   filename: 'logs/info/error-%DATE%.json',
   datePattern: 'YYYY-MM-DD-HH',
   zippedArchive: false,
   maxSize: '20m',
   maxFiles: '14d'
});

const logger = createLogger({
   format: format.combine(format.timestamp(), format.json()),
   levels: {
      'error': 0,
      'info': 1,
      'debug': 2
   },
   transports: [error_transport, info_transport],
   exceptionHandlers: [new transports.File({ filename: "winston-exceptions.log" })],
   rejectionHandlers: [new transports.File({ filename: "winston-rejections.log" })],
});

/**
 * Log only the messages the match `level`.
 */
function filterOnly(level) {
   return format(function (info) {
      if (info[LEVEL] === level) {
         return info;
      }
   })();
}

//createLogObject: take an object with properties and restructure it for logging
//minimum properties: customer and user
const createLogObject = (p) => {
   const { customer, user } = p
   return {
      //copy all properties provided, removing "customer" and "user" properties
      ...Object.assign({}, p, { customer: undefined, user: undefined }),
      //add "authentication" object:
      authentication: {
         customer: customer?.id,
         user: customer?.user?.id || user?.id
      }
   }
}

//rebuild the Strapi ctx object to make sure all needed values will be included
//and unneeded values removed
const rebuildContext = (context) => {
   return Object.assign({}, {
      params: {
         ...context.params
      },
      request: {
         files: {
            ...context.request.files
         },
         body: {
            ...context.request.body
         }
      },
      state: {
         ...context.state,
         _passport: undefined,
         session: undefined,
         user: undefined
      }
   })
}

/*wlog (winston-log): use winston module to log data to file (in JSON format)
params:
   - context: an object with all information you want to include in the log record
   - message: the message to include
*/
const wlog = (context, message, level = "debug") => {
   logger.child({ context }).log(level, message);
}

module.exports = {
   wlog,
   createLogObject,
   rebuildContext
}