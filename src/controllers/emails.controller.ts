import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';
import { EmailsService } from '../services/emails.service';

@ApiTags('emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('newsletter')
  async verifyURL(@Body() data) {
    return await this.emailsService.sendNewsletter(data.email, data.content);
  }
}
