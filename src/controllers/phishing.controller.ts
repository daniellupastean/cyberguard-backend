import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { PhishingService } from '../services/phishing.service';

@ApiTags('phishing')
@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Get()
  async findAll() {
    return await this.phishingService.findAll();
  }

  @Post()
  async classifyDomain(@Body('url') url) {
    const existingDomain = await this.phishingService.findByName(url);

    if (existingDomain) {
      return { isPhishing: existingDomain.isPhishing };
    }

    const fetch = require('node-fetch');
    const response = await fetch(process.env.ML_PHISHING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    });

    const parsedResponse = await response.json();
    const isPhishing = parsedResponse.phishing;

    await this.phishingService.create(url, isPhishing);

    return { isPhishing };
  }

  @Delete()
  async deleteAll() {
    return await this.phishingService.deleteAll();
  }
}
