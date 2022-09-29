import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankedSite } from '../entities/rankedSite.entity';

@Injectable()
export class ParserService {
  constructor(
    @InjectRepository(RankedSite)
    private readonly rankedSitesRepository: Repository<RankedSite>,
  ) {}

  async parseRecentNews(news: string[]) {
    let rank = null;
    return rank;
  }
}
