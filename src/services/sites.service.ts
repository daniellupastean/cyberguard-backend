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
    const site = this.sitesRepository.create({
      url,
      label,
    });
    await this.sitesRepository.save(site);
    return { message: 'Site added successfully' };
  }

  async updateById(id, url, label) {
    const site = await this.findById(id);
    if (!site) return { message: 'Site not found' };
    site.url = url;
    site.label = label;
    await this.sitesRepository.update(id, site);
    return { message: 'Site updated successfully' };
  }

  async findByURL(url: string) {
    return await this.sitesRepository.findOneBy({ url });
  }

  async findById(id: string) {
    return await this.sitesRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.sitesRepository.find();
  }

  async findAllByLabel() {
    return await this.sitesRepository.find({
      where: {
        label: 'satire',
      },
    });
  }

  async deleteById(id: string) {
    await this.sitesRepository.delete(id);
    return { message: 'Site successfully deleted' };
  }
}
