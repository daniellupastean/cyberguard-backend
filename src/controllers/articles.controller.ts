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
import { IdParam } from '../validators/idParam.validator';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async process(@Body() articleData: ProcessArticleDto) {
    console.log(articleData);
    return await this.articlesService.process(
      articleData.url,
      articleData.title,
      articleData.content,
      articleData.language,
    );
  }

  @Post('parse')
  async parse(@Body('url') url: string) {
    return await this.articlesService.parse(url);
  }

  @Get()
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get('10')
  async findTen() {
    return await this.articlesService.findTen();
  }

  @Get(':id')
  async findById(@Param() params: IdParam) {
    return await this.articlesService.findById(params.id);
  }

  @Put(':id')
  async updateById(@Param() params: IdParam, @Body() data: UpdateArticleDto) {
    return await this.articlesService.updateById(
      params.id,
      data.url,
      data.isFake,
      data.accuracy,
      data.title,
    );
  }

  @Delete(':id')
  async deleteById(@Param() params: IdParam) {
    return await this.articlesService.deleteById(params.id);
  }
}
