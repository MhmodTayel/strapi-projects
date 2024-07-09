module.exports = ({ env }) => ({
  "async-mail": {
    enabled: true,
    resolve: "./src/plugins/async-mail",
    config: {
      scanLimit: env("SCAN_LIMIT"),
      recipient: env("ASYNC_MAIL_RECIPIENT"),
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_SMTP_HOST', 'mc.cross-solution.de'), //SMTP Host
        port: env('EMAIL_SMTP_PORT', 465), //SMTP Port
        imapHost: env('EMAIL_IMAP_HOST', env('EMAIL_SMTP_HOST', '')),
        imapPort: env('EMAIL_IMAP_PORT', 993),
        secure: env('EMAIL_SMTP_SECURE', true),
        auth: {
          user: env('EMAIL_SMTP_USERNAME', ''),
          pass: env('EMAIL_SMTP_PASSWORD', ''),
          imapUser: env('EMAIL_IMAP_USERNAME', env('EMAIL_SMTP_USERNAME', '')),
          imapPass: env('EMAIL_IMAP_PASSWORD', env('EMAIL_SMTP_PASSWORD', '')),
        },
        rejectUnauthorized: true,
        requireTLS: true,
      },
      settings: {
        defaultFrom: env('EMAIL_SETTINGS_FROM', ''),
        defaultReplyTo: env('EMAIL_SETTINGS_REPLYTO', ''),
        reminderDelay: env.int('EMAIL_REMINDER_DELAY', 300),
        confirmEmailUrl: env(
          'CONFIRM_EMAIL_URL',
          'http://localhost:9000/#/confirm-email/'
        ),
      },
    },
  }
});
