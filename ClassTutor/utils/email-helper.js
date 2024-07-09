'use strict';
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const emailTemplateFolderPath = path.join(__dirname, '../templates/email');

async function sendEmail(subject, body, toName, toEmail) {
    const entry = await strapi.entityService.create('api::email-log.email-log', {
        data: {
            subject: subject,
            body: body,
            fromName: 'ClassTutor',
            fromEmail: 'noreply@classtutor.co.uk',
            toName: toName,
            toEmail: toEmail
        }
    });
}

async function sendTemplateEmail(template, toName, toEmail, model) {
    var templateHtml = await fs.promises.readFile(
        path.join(emailTemplateFolderPath, template.subPath, template.templateFile)
    );
    var hndlBarsBody = handlebars.compile(templateHtml.toString());
    var body = hndlBarsBody(model);

    var hndlBarsSubject = handlebars.compile(template.subject);
    var subject = hndlBarsSubject(model);

    const entry = await strapi.entityService.create('api::email-log.email-log', {
        data: {
            subject: subject,
            body: body,
            fromName: 'ClassTutor',
            fromEmail: 'noreply@classtutor.co.uk',
            toName: toName,
            toEmail: toEmail,
            templateName: template.templateFile
        }
    });
}

function getEmails(data) {
    const emails = [];
    // Check if the data is an object
    if (typeof data === 'object' && data !== null) {
        // Iterate through the object properties
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                // If the value is an email, add it to the emails array
                if (key === 'email') {
                    value && emails.push({ email: value, name: data.name, lastName: data.lastName });
                } else if (typeof value === 'object' && value !== null) {
                    // If the value is an object, recursively call getEmails
                    const nestedEmails = getEmails(value);
                    // Concatenate the nested emails with the current emails array
                    emails.push(...nestedEmails);
                }
            }
        }
    }

    return emails;
}

module.exports = {
    sendEmail,
    sendTemplateEmail,
    getEmails
};
