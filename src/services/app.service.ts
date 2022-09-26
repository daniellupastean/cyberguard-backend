import { Injectable } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { SitesService } from './sites.service';

@Injectable()
export class AppService {
  constructor(
    private readonly sitesService: SitesService,
    private readonly articlesService: ArticlesService,
  ) {}
  async verifyURL(url: string) {
    const urlParser = await require('url');
    const parsedURL = await urlParser.parse(url, true);
    const siteURL = parsedURL.protocol + '//' + parsedURL.host;
    const site = await this.sitesService.findByURL(siteURL);
    if (site) return { message: `This website is known as as ${site.label}` };
    const article = await this.articlesService.findByURL(url);
    if (article)
      return {
        isFake: article.is_fake,
        accuracy: article.accuracy,
      };

    return { message: 'No data found in CyberGuard DB' };
  }
}
