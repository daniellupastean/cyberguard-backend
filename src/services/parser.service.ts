import { Injectable } from '@nestjs/common';
import { RankedSitesService } from './rankedSites.service';
import { ArticlesService } from './articles.service';
import * as puppeteer from 'puppeteer';
import * as moment from 'moment';
import { getRank } from '../utils/utils';
import { parse } from 'path';

const isWord = require('is-word');
const englishWords = isWord('american-english');

@Injectable()
export class ParserService {
  constructor(
    private readonly rankedSitesService: RankedSitesService,
    private readonly articlesService: ArticlesService,
  ) {}

  async getArticleUrls(siteUrl: string) {
    let urls = [];
    try {
      const browser = await puppeteer.launch({
        headless: true,
        slowMo: 100,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      // await page.setDefaultNavigationTimeout(0);
      await page.goto(siteUrl);
      const getUrls = async () => {
        return await page.evaluate(() => {
          const arrayLinksData = [];
          const mapLinks = new Map();
          const arrayLinksItems = document.links;
          for (let i = 0; i < arrayLinksItems.length; i++)
            !arrayLinksData.includes(arrayLinksItems[i].href) &&
              arrayLinksData.push(arrayLinksItems[i].href);
          for (let i = 0; i < arrayLinksData.length; i++) {
            const baseLink = arrayLinksData[i].split('/')[2];
            if (mapLinks.has(baseLink))
              mapLinks.set(baseLink, mapLinks.get(baseLink) + 1);
            else mapLinks.set(baseLink, 1);
          }
          const [mostCommon] = mapLinks.keys();
          const filteredLinks = arrayLinksData
            .sort((a, b) => b.length - a.length)
            .filter(
              (link) => link.includes(mostCommon) && !link.includes('video'),
            )
            .slice(0, 5);
          return filteredLinks;
        });
      };
      urls = await getUrls();

      await page.close();
      await browser.close();
    } catch (err) {
      console.log(err);
    }

    return urls;
  }

  async parseAll() {
    const arrayLinksData = [];
    const mapLinks = new Map();
    const arrayLinksItems = document.links;
    for (let i = 0; i < arrayLinksItems.length; i++)
      !arrayLinksData.includes(arrayLinksItems[i].href) &&
        arrayLinksData.push(arrayLinksItems[i].href);
    for (let i = 0; i < arrayLinksData.length; i++) {
      const baseLink = arrayLinksData[i].split('/')[2];
      if (mapLinks.has(baseLink))
        mapLinks.set(baseLink, mapLinks.get(baseLink) + 1);
      else mapLinks.set(baseLink, 1);
    }
    const [mostCommon] = mapLinks.keys();
    const filteredLinks = arrayLinksData
      .sort((a, b) => b.length - a.length)
      .filter((link) => link.includes(mostCommon) && !link.includes('video'))
      .slice(0, 5);
    return filteredLinks;
  }

  async parseRecentNews(news: string[]) {
    let realPercentage = null;
    let slicedNews;
    const result = [];
    console.log(news);
    if (news.length > 5) slicedNews = news.slice(0, 5);
    else slicedNews = news;

    const urlParser = await require('url');
    const parsedURL = await urlParser.parse(slicedNews[0], true);
    const siteURL = parsedURL.protocol + '//' + parsedURL.host;
    const rankedSite = await this.rankedSitesService.findByURL(siteURL);
    // search in DB if this website was ranked in the last week
    if (rankedSite && moment().diff(rankedSite.updated_at, 'days') <= 7)
      return getRank(rankedSite.real_percentage);

    if (slicedNews)
      try {
        const browser = await puppeteer.launch({
          headless: true,
          slowMo: 100,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        for (let i = 0; i < slicedNews.length; i++) {
          const page = await browser.newPage();
          await page.setDefaultNavigationTimeout(0);
          await Promise.all([
            page.goto(slicedNews[i]),
            page.waitForNavigation(),
          ]);
          const pageData = await page.evaluate((url: string) => {
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
              ?.textContent?.trim();
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
          }, slicedNews[i]);
          result.push(pageData);
          await page.close();
        }
        await browser.close();
      } catch (err) {
        console.log(err);
      }
    // result = result.map((pageData) => {
    //   let newPageData = { ...pageData };
    //   newPageData.content = newPageData.content
    //     .split(' ')
    //     .filter((word: string): boolean => englishWords.check(word))
    //     .join(' ');
    //   return newPageData;
    // });

    console.log(result);

    let reals = 0;
    for (let i = 0; i < result.length; i++) {
      const processedResult = await this.articlesService.process(
        result[i].url,
        result[i].title,
        result[i].content,
      );
      if (processedResult && !processedResult.isFake) reals++;
    }
    realPercentage = (reals * 100) / result.length;
    await this.rankedSitesService.create(siteURL, realPercentage);
    return getRank(realPercentage);
  }
}
