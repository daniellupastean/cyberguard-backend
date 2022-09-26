import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('verifyURL')
  async verifyURL(@Body() data: VerifyUrlDto) {
    return await this.appService.verifyURL(data.url);
  }
}
