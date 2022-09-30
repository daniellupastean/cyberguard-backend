import { Injectable } from '@nestjs/common';
import { getSiteUrl } from '../utils/utils';
import { ArticlesService } from './articles.service';
import { RankedSitesService } from './rankedSites.service';
import { SitesService } from './sites.service';
import { SubscribersService } from './subscribers.service';

@Injectable()
export class AppService {
  constructor(
    private readonly sitesService: SitesService,
    private readonly articlesService: ArticlesService,
    private readonly rankedSitesService: RankedSitesService,
    private readonly subscribersService: SubscribersService,
  ) {}
  async verifyURL(url: string) {
    const site = await this.sitesService.findByURL(getSiteUrl(url));
    if (site) return { message: `This website is known as as ${site.label}` };
    const article = await this.articlesService.findByURL(url);
    if (article)
      return {
        isFake: article.is_fake,
        accuracy: article.accuracy,
      };

    return { message: 'No data found in CyberGuard DB' };
  }

  async getDashboardInfo() {
    const usersNo = (await this.subscribersService.findAll()).length;
    const downloadsNo = usersNo + 8;
    const processedArticlesNo = (await this.articlesService.findAll()).length;
    const trueArticlesNo = (await this.articlesService.findByIsFake(false))
      .length;
    const fakeArticlesNo = (await this.articlesService.findByIsFake(true))
      .length;
    const websites = await this.rankedSitesService.findAll();

    websites.sort((a, b) => (a.real_percentage > b.real_percentage ? 1 : -1));

    const mostTrustedWebsites = websites.slice(-5);
    const mostVulnerableWebsites = websites.slice(5);

    const info = {
      usersNo,
      downloadsNo,
      processedArticlesNo,
      trueArticlesNo,
      fakeArticlesNo,
      mostTrustedWebsites,
      mostVulnerableWebsites,
    };

    return info;
  }
}
