import { Controller, Post, Get, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';
import { ParserService } from '../services/parser.service';
import { TranslateService } from '../services/translate.service';
import { PhishingService } from '../services/phishing.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly parserService: ParserService,
    private readonly translateService: TranslateService,
    private readonly phishingService: PhishingService,
  ) {}

  @Post('verify-url')
  async verifyURL(@Body() data: VerifyUrlDto) {
    return await this.appService.verifyURL(data.url);
  }

  @Post('parse-recent-news')
  async parseRecentNews(@Body() data) {
    return await this.parserService.parseRecentNews(data.news);
  }

  @Get('dashboard-info')
  async getDashboardInfo() {
    return await this.appService.getDashboardInfo();
  }

  @Post('deepl-translate')
  async translate(@Body() data) {
    return await this.translateService.deeplTranslate(data.text, data.language);
  }
}
