import { Controller, Post, Get, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';
import { ParserService } from '../services/parser.service';
import { TranslateService } from '../services/translate.service';
import { PhishingService } from '../services/phishing.service';
import { RankedSitesService } from '../services/rankedSites.service';
import * as moment from 'moment';
import { getRank } from '../utils/utils';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly parserService: ParserService,
    private readonly translateService: TranslateService,
    private readonly rankedSitesService: RankedSitesService,
  ) {}

  @Post('verify-url')
  async verifyURL(@Body() data: VerifyUrlDto) {
    return await this.appService.verifyURL(data.url);
  }

  @Post('parse-recent-news')
  async parseRecentNews(@Body('url') url: string) {
    const rankedSite = await this.rankedSitesService.findByURL(url);
    // search in DB if this website was ranked in the last week
    if (rankedSite && moment().diff(rankedSite.updated_at, 'days') <= 7)
      return getRank(rankedSite.real_percentage);

    const articleUrls = await this.parserService.getArticleUrls(url);
    console.log(articleUrls);
    return await this.parserService.parseRecentNews(articleUrls);
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
