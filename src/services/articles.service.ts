import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { url } from 'inspector';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import * as puppeteer from 'puppeteer';

const isWord = require('is-word');
const englishWords = isWord('american-english');
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
    const existingArticle = await this.findByURL(url);
    if (existingArticle)
      return {
        isFake: existingArticle.is_fake,
        accuracy: existingArticle.accuracy,
      };
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

  async parse(articleUrl: string) {
    let pageData = null;

    const existingArticle = await this.findByURL(articleUrl);
    if (existingArticle)
      return {
        isFake: existingArticle.is_fake,
        accuracy: existingArticle.accuracy,
      };
    try {
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        devtools: false,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await Promise.all([page.goto(articleUrl), page.waitForNavigation()]);
      pageData = await page.evaluate((url: string) => {
        const getValidContent = (text: string): string => {
          const textData = text?.replace(/\s{2,}/g, ' ').trim();
          return textData;
        };

        const pageDetails = {
          url: url,
          title: '',
          content: '',
        };
        let content = '';
        const title = document
          .getElementsByTagName('h1')[0]
          .textContent?.trim();
        const pageElements = document.getElementsByTagName('DIV');
        for (let i = 0; i < pageElements.length; i++) {
          if (
            pageElements[i].tagName === 'SECTION' ||
            pageElements[i].classList.value.includes('article')
          ) {
            const contentNews = getValidContent(pageElements[i]?.textContent);
            if (content.length < contentNews.length) content = contentNews;
          }
        }
        if (content === '') {
          const articles = document.getElementsByTagName('ARTICLE');
          for (let j = 0; j < articles.length; j++) {
            const contentNews = getValidContent(articles[j]?.textContent);
            if (content.length < contentNews.length) content = contentNews;
          }
        }
        pageDetails.title = title;
        pageDetails.content = content;
        return pageDetails;
      }, articleUrl);
      await page.close();
      await browser.close();
    } catch (err) {
      console.log(err);
    }

    let newPageData = { ...pageData };

    newPageData.content = newPageData.content
      .split(' ')
      .filter((word: string): boolean => englishWords.check(word))
      .join(' ');

    return await this.process(
      newPageData.url,
      newPageData.title,
      newPageData.content,
    );
  }

  async deleteById(id: string) {
    const article = await this.findById(id);
    if (!article) return { message: 'Article not found' };
    await this.articlesRepository.delete(id);
    return { message: 'Article successfully deleted' };
  }
}
