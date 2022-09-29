import { Injectable } from '@nestjs/common';
import { RankedSitesService } from './rankedSites.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ParserService {
  constructor(private readonly rankedSitesService: RankedSitesService) {}

  async parseRecentNews(news: string[]) {
    let slicedNews;
    const result = [];
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
        const pageData = await page.evaluate((url: string) => {
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
              const contentNews = pageElements[i]?.textContent
                ?.replace(/\s{2,}/g, ' ')
                .trim();
              if (content.length < contentNews.length) content = contentNews;
            }
          }
          if (content === '') {
            const articles = document.getElementsByTagName('ARTICLE');
            for (let j = 0; j < articles.length; j++) {
              const contentNews = articles[j]?.textContent
                ?.replace(/\s{2,}/g, ' ')
                .trim();
              if (content.length < contentNews.length) content = contentNews;
            }
          }
          pageDetails.title = title;
          pageDetails.content = content;
          return pageDetails;
        }, slicedNews[i]);
        result.push(pageData);
        await page.close();
      }
      //work with result, call Damian API
      await browser.close();
    } catch (err) {
      console.log(err);
    }
    return 'rank';
  }
}
