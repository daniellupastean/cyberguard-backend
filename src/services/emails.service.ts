import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Injectable()
export class EmailsService {
  constructor(
    private mailerService: MailerService,
    private readonly subscribersService: SubscribersService,
  ) {}

  async sendNewsletter(email, content) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'CyberGuard Newsletter',
      text: content,
    });

    return { message: `We have emailed the newsletter to "${email}"` };
  }
}
