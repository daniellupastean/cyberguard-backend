import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(url: string, isFake: boolean, accuracy: number) {
    // create article object
    const article = this.articlesRepository.create({
      url,
      is_fake: isFake,
      accuracy,
    });
    // add article in DB
    await this.articlesRepository.save(article);
    return { isFake: isFake, accuracy: accuracy };
  }

  async updateById(id, url, isFake, accuracy) {
    const article = await this.findById(id);
    if (!article) return { message: 'Article not found' };
    article.url = url;
    article.is_fake = isFake;
    article.accuracy = accuracy;
    await this.articlesRepository.update(id, article);
    return { message: 'Article updated successfully' };
  }

  async findByURL(url: string) {
    return await this.articlesRepository.findOneBy({ url });
  }

  async findByIsFake(isFake: boolean) {
    return await this.articlesRepository.find({
      where: {
        is_fake: isFake,
      },
    });
  }

  async findById(id: string) {
    return await this.articlesRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.articlesRepository.find();
  }

  async process(url: string, title: string, content: string) {
    // here will call the endpoint from python BE
    // will call the create function with the received data
    // for now will use some dummy data

    const isFake = true;
    const accuracy = 79;

    return await this.create(url, isFake, accuracy);
  }

  async deleteById(id: string) {
    const article = await this.findById(id);
    if (!article) return { message: 'Article not found' };
    await this.articlesRepository.delete(id);
    return { message: 'Article successfully deleted' };
  }
}
