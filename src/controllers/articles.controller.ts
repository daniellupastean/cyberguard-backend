import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { ProcessArticleDto } from '../dtos/processArticle.dto';
import { UpdateArticleDto } from '../dtos/updateArticle.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async process(@Body() articleData: ProcessArticleDto) {
    return await this.articlesService.process(
      articleData.url,
      articleData.title,
      articleData.content,
    );
  }

  @Get()
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.articlesService.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() data: UpdateArticleDto) {
    return await this.articlesService.updateById(
      id,
      data.url,
      data.isFake,
      data.accuracy,
    );
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.articlesService.deleteById(id);
  }
}
