import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../entities/site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private readonly sitesRepository: Repository<Site>,
  ) {}

  async create(url: string, label: string) {
    // create site object
    const site = this.sitesRepository.create({
      url,
      label,
    });
    // add site in DB
    await this.sitesRepository.save(site);
    return { message: 'Site added successfully' };
  }
}
