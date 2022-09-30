import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { EmailsService } from '../services/emails.service';

@ApiTags('emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('newsletter')
  async sendNewsletter(@Body() data) {
    return await this.emailsService.sendNewsletter(data.content);
  }
}
