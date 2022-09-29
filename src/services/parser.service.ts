import { Injectable } from '@nestjs/common';
import { RankedSitesService } from './rankedSites.service';
import * as puppeteer from 'puppeteer';

const enRegex = require('./en-regex');

const isWord = require('is-word');
const englishWords = isWord('american-english');

@Injectable()
export class ParserService {
  constructor(private readonly rankedSitesService: RankedSitesService) {}

  async parseRecentNews(news: string[]) {
    let slicedNews;
    let result = [];
    if (news.length > 10) slicedNews = news.slice(0, 10);
    else slicedNews = news;

    try {
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        devtools: false,
      });
      for (let i = 0; i < slicedNews.length; i++) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await Promise.all([page.goto(slicedNews[i]), page.waitForNavigation()]);
        const pageData = await page.evaluate(
          (url: string) => {
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
                const contentNews = getValidContent(
                  pageElements[i]?.textContent,
                );
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
          },
          slicedNews[i],
          enRegex,
        );
        result.push(pageData);
        await page.close();
      }
      console.log(result);
      //work with result, call Damian API
      await browser.close();
    } catch (err) {
      console.log(err);
    }
    result = result.map((pageData) => {
      let newPageData = { ...pageData };
      newPageData.content = newPageData.content
        .replaceAll('}', ' ')
        .replaceAll('{', ' ')
        .split(' ')
        .filter((word: string): boolean => englishWords.check(word))
        .join(' ')
      return newPageData;
    });
    return 'rank';
  }
}
