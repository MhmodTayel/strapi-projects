/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */

const { sanitizeEntity } = require('strapi-utils');

const replaceWildcard = (original, wildcard_code, wildcard_value) => {
  if (!wildcard_value) {
    wildcard_value = '';
  }
  const regexp_txt = `(\\*\\*\\*${wildcard_code}\\*\\*\\*)`;
  const regexp = new RegExp(regexp_txt, 'g');
  const ret = original.replace(regexp, wildcard_value);
  return ret;
};

const getEmailTemplates = async (locale = 'en') => {
  let emailTemplates;
  try {
    const emailTemplatesArray = await strapi.entityService.findMany(
      'api::email-notification.email-notification',
      {
        locale,
        populate: '*',
      }
    );
    emailTemplates = emailTemplatesArray ? emailTemplatesArray[0] : null;
  } catch (e) {
    console.log('error retrieving email templates. error:', e.message);
  }
  return emailTemplates;
};

const sendMail = ({
  from_address,
  from_label,
  to_address,
  to_label,
  reply_address,
  reply_label,
  template_subject,
  template_content_text,
  template_content_html,
  params,
}) => {
  const myTemplate = {
    subject: template_subject,
    text: template_content_text,
    html: template_content_html,
  };

  if (process.env.NODE_ENV === 'production') {
    return strapi.plugins.email.services.email.sendTemplatedEmail(
      {
        from: `${from_label ? from_label + ' <' : ''}${from_address}${
          from_label ? '>' : ''
        }`,
        to: `${to_label ? to_label + ' <' : ''}${to_address}${
          to_label ? '>' : ''
        }`,
        replyTo: `${reply_label ? reply_label + ' <' : ''}${reply_address}${
          reply_label ? '>' : ''
        }`,
      },
      myTemplate,
      params
    );
  }
};

module.exports = {
  sendMail,
  getEmailTemplates,
  replaceWildcard,
};
