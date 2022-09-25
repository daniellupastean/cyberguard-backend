import { Controller, Post, Get, Body } from '@nestjs/common';
import { SitesService } from '../services/sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body('url') url: string, @Body('label') label: string) {
    // add validations & throw errors here if neeeded
    return this.sitesService.create(url, label);
  }
}
