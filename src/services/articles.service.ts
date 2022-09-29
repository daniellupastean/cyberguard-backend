import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { url } from 'inspector';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';

const urlParser = require('url');

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(url: string, isFake: boolean, accuracy: number, title: string) {
    // create article object
    const article = this.articlesRepository.create({
      url,
      title,
      is_fake: isFake,
      accuracy,
    });
    // add article in DB
    await this.articlesRepository.save(article);
    return { isFake: isFake, accuracy: accuracy };
  }

  async updateById(id, url, isFake, accuracy, title) {
    const article = await this.findById(id);
    if (!article) return { message: 'Article not found' };
    article.url = url;
    article.is_fake = isFake;
    article.accuracy = accuracy;
    article.title = title;
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

  async findTen() {
    const rawArticles = await this.articlesRepository.find({ take: 10 });
    const mappedArticles = rawArticles.map((article) => {
      const parsedURL = urlParser.parse(article.url, true);
      return {
        id: article.id,
        title: article.title,
        website: parsedURL.host,
        url: article.url,
        accuracy: article.accuracy,
        isFake: article.is_fake,
      };
    });

    return mappedArticles;
  }

  async process(url: string, title: string, content: string) {
    const fetch = require('node-fetch');

    const response = await fetch('http://54.229.94.228:8000/classify', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    const parsedResponse = await response.json();
    const isFake = parsedResponse.prediction === 'fake' ? true : false;
    const accuracy = parseInt(parsedResponse.probability);

    return await this.create(url, isFake, accuracy, title);
  }

  async deleteById(id: string) {
    const article = await this.findById(id);
    if (!article) return { message: 'Article not found' };
    await this.articlesRepository.delete(id);
    return { message: 'Article successfully deleted' };
  }
}
