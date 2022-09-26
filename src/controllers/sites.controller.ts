import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { SitesService } from '../services/sites.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { CreateSiteDto } from '../dtos/createSite.dto';
import { IdParam } from '../validators/idParam.validator';

@ApiTags('sites')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async findAll() {
    return await this.sitesService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: IdParam) {
    return await this.sitesService.findById(params.id);
  }

  @Post()
  async create(@Body() siteData: CreateSiteDto) {
    return await this.sitesService.create(siteData.url, siteData.label);
  }

  @Put(':id')
  async updateById(@Param() params: IdParam, @Body() data: CreateSiteDto) {
    return await this.sitesService.updateById(params.id, data.url, data.label);
  }

  @Delete(':id')
  async deleteById(@Param() params: IdParam) {
    return await this.sitesService.deleteById(params.id);
  }

  @Delete()
  async deleteAll() {
    return await this.sitesService.deleteAll();
  }
}
