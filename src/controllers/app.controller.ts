import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { VerifyUrlDto } from '../dtos/verifyUrl.dto';
import { ParserService } from '../services/parser.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly parserService: ParserService,
  ) {}

  @Post('verifyURL')
  async verifyURL(@Body() data: VerifyUrlDto) {
    return await this.appService.verifyURL(data.url);
  }

  @Post('parseRecentNews')
  async parseRecentNews(@Body() data) {
    // this endpoint process the last 20 articles from a certain website to calculate a rank
    return await this.parserService.parseRecentNews(data.news);
  }
}
