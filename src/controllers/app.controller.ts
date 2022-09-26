import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return 'Cyberguard API is ON';
  }

  @Post('verifyURL')
  async verifyURL(@Body() data: VerifyUrlDto) {
    return await this.appService.verifyURL(data.url);
  }
}
