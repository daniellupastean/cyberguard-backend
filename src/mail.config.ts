import { MailerOptions } from '@nestjs-modules/mailer';

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST,
    port: 25,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  defaults: {
    from: `"CyberGuard" <${process.env.MAIL_FROM}>`,
  },
};
