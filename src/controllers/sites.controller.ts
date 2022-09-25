import { Controller, Post, Get, Put, Body, Delete } from '@nestjs/common';
import { SitesService } from '../services/sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async findAll() {
    return await this.sitesService.findAll();
  }

  @Post()
  async create(@Body('url') url: string, @Body('label') label: string) {
    return await this.sitesService.create(url, label);
  }

  @Put()
  async updateById(
    @Body('id') id: string,
    @Body('url') url: string,
    @Body('label') label: string,
  ) {
    return await this.sitesService.updateById(id, url, label);
  }

  @Delete()
  async deleteById(@Body('id') id: string) {
    return await this.sitesService.deleteById(id);
  }
}
