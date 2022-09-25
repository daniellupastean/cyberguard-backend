import { Controller, Post, Get, Body } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  process(
    @Body('url') url: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.articlesService.process(url, title, content);
  }
}
