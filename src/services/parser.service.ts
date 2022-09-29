import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankedSite } from '../entities/rankedSite.entity';
import { RankedSitesService } from './rankedSites.service';

@Injectable()
export class ParserService {
  constructor(
    @InjectRepository(RankedSite)
    private readonly rankedSitesService: RankedSitesService,
  ) {}

  async parseRecentNews(news: string[]) {
    let rank = null;

    // scrape the news articles, get the title & content and then process the info about each article

    // save rankedSite in DB

    return rank;
  }
}
