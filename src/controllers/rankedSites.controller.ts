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
import { RankedSitesService } from '../services/rankedSites.service';

@ApiTags('ranked sites')
@Controller('rankedSites')
export class RankedSitesController {
  constructor(private readonly rankedSitesService: RankedSitesService) {}

  @Get()
  async findAll() {
    return await this.rankedSitesService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: IdParam) {
    return await this.rankedSitesService.findById(params.id);
  }

  @Post('checkUrl')
  async findByURL(@Body('url') url: string) {
    return await this.rankedSitesService.findByURL(url);
  }

  @Put(':id')
  async updateById(@Param() params: IdParam, @Body() data: CreateSiteDto) {
    return await this.rankedSitesService.updateById(
      params.id,
      data.url,
      data.label,
    );
  }

  @Delete(':id')
  async deleteById(@Param() params: IdParam) {
    return await this.rankedSitesService.deleteById(params.id);
  }

  @Delete()
  async deleteAll() {
    return await this.rankedSitesService.deleteAll();
  }
}
