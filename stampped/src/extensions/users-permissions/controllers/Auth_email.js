/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */

const crypto = require('crypto');
const email = require('../../../../util/email');

const sendConfirmEmailMessage = async (user, customer, locale = 'en') => {
  /*--------------------
     send a welcome email after confirming email address (local accounts) or registering with external provider
     ALSO: create a confirmation token and store it in the "user" collection
     ----------------------
     available wildcard parameters:
     - USER_NAME
     - CONFIRMATION_URL
     - CONFIRMATION_CODE
     */

  //fetch the email addresses and template from the CMS
  const allTemplates = await email.getEmailTemplates(locale);
  let template = allTemplates.new_user_email_confirmation_message;

  //create confirmation token and store in db:
  const confirmationToken = crypto.randomBytes(20).toString('hex');
  await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: user.id },
    data: { confirmationToken },
  });

  //replace wildcard variable USER_NAME:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'USER_NAME',
    user.username
  );
  template.subject = email.replaceWildcard(
    template.subject,
    'USER_NAME',
    user.username
  );
  //replace wildcard variable CONFIRMATION_URL:
  const confirmationUrl = `${process.env.PUBLIC_URL}/api/auth/email-confirmation?confirmation=${confirmationToken}&locale=${locale}`;
  template.content_html = email.replaceWildcard(
    template.content_html,
    'CONFIRMATION_URL',
    confirmationUrl
  );
  // template.subject = email.replaceWildcard(template.subject, "CONFIRMATION_URL", confirmationUrl)
  //replace wildcard variable CONFIRMATION_CODE:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'CONFIRMATION_CODE',
    confirmationToken
  );
  // template.subject = email.replaceWildcard(template.subject, "CONFIRMATION_CODE", confirmationToken)

  console.log('template:', template);

  email.sendMail({
    from_address: template.sender_address,
    from_label: template.sender_label,
    to_address: user.email,
    to_label: user.name,
    reply_address: template.reply_address,
    reply_label: template.reply_label,
    template_subject: template.subject,
    template_content_html: template.content_html,
  });
  return;
};
const sendResetPasswordMail = async (user, customer, locale = 'en') => {
  /*--------------------
     send a welcome email after confirming email address (local accounts) or registering with external provider
     ALSO: create a confirmation token and store it in the "user" collection
     ----------------------
     available wildcard parameters:
     - USER_NAME
     - CONFIRMATION_URL
     - CONFIRMATION_CODE
     */

  //fetch the email addresses and template from the CMS
  const allTemplates = await email.getEmailTemplates(locale);
  let template = allTemplates.password_forgotten_reset_link_message;

  //create confirmation token and store in db:
  const resetPasswordToken = crypto.randomBytes(20).toString('hex');
  await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: user.id },
    data: { resetPasswordToken },
  });

  //replace wildcard variable USER_NAME:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'USER_NAME',
    user.username
  );
  template.subject = email.replaceWildcard(
    template.subject,
    'USER_NAME',
    user.username
  );
  //replace wildcard variable CONFIRMATION_URL:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'TOKEN',
    resetPasswordToken
  );

  console.log('template:', template);

  email.sendMail({
    from_address: template.sender_address,
    from_label: template.sender_label,
    to_address: user.email,
    to_label: user.name,
    reply_address: template.reply_address,
    reply_label: template.reply_label,
    template_subject: template.subject,
    template_content_html: template.content_html,
  });
  return;
};

const sendWelcomeEmailIndividual = async (user, customer, locale = 'en') => {
  /*--------------------
   send a welcome email after confirming email address (local accounts) or registering with external provider
   ----------------------
   available wildcard parameters:
   - USER_NAME
   */

  //fetch the email addresses and template from the CMS
  const allTemplates = await email.getEmailTemplates(locale);
  let template = allTemplates.new_individual_account_welcome_message;
  //replace wildcard variable USER_NAME:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'USER_NAME',
    user.username
  );
  template.subject = email.replaceWildcard(
    template.subject,
    'USER_NAME',
    user.username
  );

  console.log('template:', template);

  email.sendMail({
    from_address: template.sender_address,
    from_label: template.sender_label,
    to_address: user.email,
    to_label: user.name,
    reply_address: template.reply_address,
    reply_label: template.reply_label,
    template_subject: template.subject,
    template_content_html: template.content_html,
  });
  return;
};

const sendWelcomeEmailCompany = async (user, customer, locale = 'en') => {
  /*--------------------
   send a welcome email after confirming email address (local accounts) or registering with external provider
   ----------------------
   available wildcard parameters:
   - USER_NAME
   - VERIFY_URL
   */

  //fetch the email addresses and template from the CMS
  const allTemplates = await email.getEmailTemplates(locale);
  let template = allTemplates.new_company_account_welcome_message;
  //replace wildcard variable USER_NAME:
  template.content_html = email.replaceWildcard(
    template.content_html,
    'USER_NAME',
    user.username
  );
  template.subject = email.replaceWildcard(
    template.subject,
    'USER_NAME',
    user.username
  );
  //replace wildcard variable VERIFY_URL:
  const verifyUrl = `${process.env.FRONTEND_URL}${process.env.FRONTEND_TEST_VERSION}/${locale}/verify`;
  template.content_html = email.replaceWildcard(
    template.content_html,
    'VERIFY_URL',
    verifyUrl
  );
  // template.subject = email.replaceWildcard(template.subject, "VERIFY_URL", verifyUrl)

  console.log('template:', template);

  email.sendMail({
    from_address: template.sender_address,
    from_label: template.sender_label,
    to_address: user.email,
    to_label: user.name,
    reply_address: template.reply_address,
    reply_label: template.reply_label,
    template_subject: template.subject,
    template_content_html: template.content_html,
  });
  return;
};

module.exports = {
  sendConfirmEmailMessage,
  sendWelcomeEmailIndividual,
  sendWelcomeEmailCompany,
  sendResetPasswordMail,
};
