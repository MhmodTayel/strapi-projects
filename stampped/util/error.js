const { createLogObject, wlog, rebuildContext } = require('./winston-logger')
const { getLatestErrorFileWithPath, getCurrentSystemTime } = require('./../util/errorfiles')
const emailNotifications = require('./../util/email-notifications')

const criticalError = ({ ctx, error, order, paymentProcessor, ...rest }) => {
   console.log("critical error. logging error")
   logError({ ctx, error, ...rest })
   // send a notification about the error to an IT admin
   console.log("critical error. sending notification message to IT department")
   emailNotifications.sendPaymentNotificationErrorToITAdmin({
      order,
      paymentProcessor,
      errorMessage: error?.message,
      errorFile: getLatestErrorFileWithPath(),
      errorTime: getCurrentSystemTime()
   })
}

const logError = ({ ctx, error, ...rest }) => {
   wlog(
      createLogObject({
         ...rebuildContext(ctx), ...rest, error
      }),
      'A payment processing error has occurred.',
      "error")
   const errorFile = getLatestErrorFileWithPath()
   console.log("logged error: ", errorFile);
   return errorFile
}

module.exports = {
   logError,
   criticalError
}