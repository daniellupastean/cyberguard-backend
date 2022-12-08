import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import translate from 'translate';
import * as puppeteer from 'puppeteer-core';
import { TranslateService } from './translate.service';

const isWord = require('is-word');
const englishWords = isWord('american-english');
const urlParser = require('url');

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    private readonly translateService: TranslateService,
  ) {}

  async create(
    url: string,
    isFake: boolean,
    accuracy: number,
    title: string,
    content: string,
  ) {
    const article = this.articlesRepository.create({
      url,
      title,
      is_fake: isFake,
      accuracy,
      content,
    });
    await this.articlesRepository.save(article);
    return { isFake, accuracy, title, url, content };
  }

  async updateById(
    id: string,
    url: string,
    isFake: boolean,
    accuracy: number,
    title: string,
  ) {
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

  async process(
    url: string,
    title: string,
    content: string,
    language: string = 'en',
  ) {
    content = content.replace(/\s\s+/g, ' ');

    const existingArticle = await this.findByURL(url);
    if (existingArticle)
      return {
        title: title,
        url: url,
        content: content,
        isFake: existingArticle.is_fake,
        accuracy: existingArticle.accuracy,
      };

    const fetch = require('node-fetch');

    let mlTitle = title;
    let mlContent = content;

    if (language !== 'en') {
      mlTitle = await this.translateService.deeplTranslate(title, language);
      mlContent = await this.translateService.deeplTranslate(content, language);
    }

    console.log('ML Title: ' + mlTitle);
    console.log('ML Content: ' + mlContent);

    const response = await fetch(process.env.ML_FAKE_NEWS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title: mlTitle,
        body: mlContent,
      }),
    });

    const parsedResponse = await response.json();
    const isFake = parsedResponse.prediction === 'fake' ? true : false;
    const accuracy = Math.trunc(parseFloat(parsedResponse.probability));

    return await this.create(url, isFake, accuracy, title, content);
  }

  async parse(articleUrl: string) {
    let pageData = null;

    const existingArticle = await this.findByURL(articleUrl);
    if (existingArticle)
      return {
        isFake: existingArticle.is_fake,
        accuracy: existingArticle.accuracy,
        url: existingArticle.url,
        title: existingArticle.title,
        content: existingArticle.content,
      };
    try {
      const browser = await puppeteer.launch({
        headless: true,
        slowMo: 100,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

        console.log('Title: ' + title);
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
    console.log('content ', newPageData.content);
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
