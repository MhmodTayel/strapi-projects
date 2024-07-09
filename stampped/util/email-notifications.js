const email = require('./email')

/*--------------------
  send a message to an admin at the IT department when a critical issue has arisen in a payment webhook
  which couldn't be solved by the webhook
  ----------------------
  available wildcard parameters:
  - PAYMENT_PROCESSOR: the payment processor used
  - ERROR_LOG_LOCATION: the location of the error log file on the server
  - ORDER_UUID: the uuid for the order involved, if available
  */
const sendPaymentNotificationErrorToITAdmin = async ({ order, paymentProcessor, errorFile, errorTime }) => {
   let template = {
      "sender_address": process.env.PAYMENT_WEBHOOK_ISSUES_SENDER_EMAIL,
      "sender_label": `${process.env.APP_NAME} payment webhook`,
      "to_address": process.env.PAYMENT_WEBHOOK_ISSUES_TO_EMAIL,
      "to_label": `${process.env.BUSINESS_NAME} IT department - payment webhook issues`,
      "subject": `${process.env.APP_NAME} - A critical payment webhook issue needs your attention`,
      "content_html": `<p><strong>Hi,</strong></p><p>&nbsp;</p><p>A critical payment issue has arisen. ***PAYMENT_PROCESSOR*** has notified your payment webhook of a payment event, and some issue arose which the webhook could not solve.An error log has been created.</p><p>&nbsp;</p><p>The order uuid of the created order is: ***ORDER_UUID***</p><p>&nbsp;</p><p>The time that the error occurred: ***ERROR_TIME***</p><p>&nbsp;</p><p>Here is the location of the error log created by the webhook:</p><p>***ERROR_FILE***</p><p>&nbsp;</p><p>The ${process.env.APP_NAME} team</p>`,
      "reply_address": process.env.PAYMENT_WEBHOOK_ISSUES_REPLY_EMAIL,
      "reply_label": null
   }

   //replace wildcard variable PAYMENT_PROCESSOR:
   template.content_html = email.replaceWildcard(template.content_html, "PAYMENT_PROCESSOR", paymentProcessor)
   //replace wildcard variable ERROR_LOG_LOCATION:
   template.content_html = email.replaceWildcard(template.content_html, "ERROR_FILE", errorFile)
   //replace wildcard variable ERROR_TIME:
   template.content_html = email.replaceWildcard(template.content_html, "ERROR_TIME", errorTime)
   //replace wildcard variable ORDER_UUID:
   template.content_html = email.replaceWildcard(template.content_html, "ORDER_UUID", order?.uuid || "(no uuid)")
   console.log("template (after):", template)

   try {
      email.sendMail({
         from_address: template.sender_address,
         from_label: template.sender_label,
         to_address: template.to_address,
         to_label: template.to_label,
         reply_address: template.reply_address,
         reply_label: template.reply_label,
         template_subject: template.subject,
         template_content_html: template.content_html,
      })
   } catch (e) {
      console.log("sendmail error:", e)
   }
   return;
}

module.exports = {
   sendPaymentNotificationErrorToITAdmin
}