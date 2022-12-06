import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankedSite } from '../entities/rankedSite.entity';

@Injectable()
export class RankedSitesService {
  constructor(
    @InjectRepository(RankedSite)
    private readonly rankedSitesRepository: Repository<RankedSite>,
  ) {}

  async create(url: string, realPercentage: number) {
    const existingSite = await this.findByURL(url);
    if (existingSite) return { message: 'This site already exists' };
    const rankedSite = this.rankedSitesRepository.create({
      url,
      real_percentage: realPercentage,
    });
    await this.rankedSitesRepository.save(rankedSite);
    return { message: 'Ranked site added successfully' };
  }

  async updateById(id, url, realPercentage) {
    const site = await this.findById(id);
    if (!site) return { message: 'Site not found' };
    site.url = url;
    site.real_percentage = realPercentage;
    await this.rankedSitesRepository.update(id, site);
    return { message: 'Site updated successfully' };
  }

  async findByURL(url: string) {
    return await this.rankedSitesRepository.findOneBy({ url });
  }

  async findById(id: string) {
    return await this.rankedSitesRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.rankedSitesRepository.find();
  }

  async findTop5Trusted() {
    return await this.rankedSitesRepository.find({
      order: {
        real_percentage: 'DESC',
      },
      take: 5,
    });
  }

  async findTop5Vulnerable() {
    return await this.rankedSitesRepository.find({
      order: {
        real_percentage: 'ASC',
      },
      take: 5,
    });
  }

  async findAllByRealPercentage(realPercentage) {
    return await this.rankedSitesRepository.find({
      where: {
        real_percentage: realPercentage,
      },
    });
  }

  async deleteById(id: string) {
    const site = await this.findById(id);
    if (!site) return { message: 'Site not found' };
    await this.rankedSitesRepository.delete(id);
    return { message: 'Site successfully deleted' };
  }

  async deleteAll() {
    const sites = await this.findAll();
    if (sites && sites.length > 0) {
      await this.rankedSitesRepository.remove(sites);
      return { message: 'Sites removed' };
    }
    return { message: "There's no ranked site in DB" };
  }
}
