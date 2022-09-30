import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Injectable()
export class EmailsService {
  constructor(
    private mailerService: MailerService,
    private readonly subscribersService: SubscribersService,
  ) {}

  async sendNewsletter(content: string) {
    const promiseArray = [];
    const subscribers = await this.subscribersService.findAll();
    subscribers.forEach((subscriber) => {
      promiseArray.push(
        this.mailerService.sendMail({
          to: subscriber.email,
          subject: 'CyberGuard Newsletter',
          text: content,
        }),
      );
    });

    await Promise.all(promiseArray);

    return { message: `Newsletter sent to all subscribers` };
  }
}
