import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return 'Cyberguard API is ON';
  }

  @Post('verifyURL')
  async verifyURL(@Body('url') url: string) {
    return await this.appService.verifyURL(url);
  }
}
