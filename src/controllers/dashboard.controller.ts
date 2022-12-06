import { Controller, Get } from '@nestjs/common';
import { SitesService } from '../services/sites.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { ArticlesService } from '../services/articles.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly sitesService: SitesService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Get('statistics')
  async getStatistics() {
    const result = {
      downloads: 0,
      users: 0,
      analyses: 0,
      phishing: 0,
      websiets: 0,
    };
    return result;
  }

  @Get('most-trusted-sites')
  async getMostTrustedSites() {
    const result = [
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
    ];
    return result;
  }

  @Get('most-vulnerable-sites')
  async getMostVulneralbeSites() {
    const result = [
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
      {
        website: 'www.theguardian.com',
        fakeNews: 13,
        realNews: 24,
        percentage: (100 * 24) / (24 + 13),
      },
    ];
    return result;
  }

  @Get('analyses-summary')
  async getAnalysesSummary() {
    const result = {
      fakeNews: 0,
      realNews: 0,
    };
    return result;
  }
}
