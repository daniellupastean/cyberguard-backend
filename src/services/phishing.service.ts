import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassifiedDomain } from '../entities/classified-domains.entity';

@Injectable()
export class PhishingService {
  constructor(
    @InjectRepository(ClassifiedDomain)
    private readonly classifiedDomainsRepository: Repository<ClassifiedDomain>,
  ) {}

  async create(name: string, isPhishing: boolean) {
    const contactMessage = this.classifiedDomainsRepository.create({
      name,
      isPhishing,
    });
    return await this.classifiedDomainsRepository.save(contactMessage);
  }

  async findAll() {
    return await this.classifiedDomainsRepository.find();
  }

  async findByName(name: string) {
    return await this.classifiedDomainsRepository.findOneBy({ name });
  }

  async deleteAll() {
    const domains = await this.findAll();
    if (domains && domains.length > 0) {
      await this.classifiedDomainsRepository.remove(domains);
      return { message: 'Classified domains have been removed' };
    }
    return { message: "There's no classified domains in DB" };
  }
}
