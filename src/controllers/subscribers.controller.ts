import { Controller, Post, Get, Put, Body, Delete } from '@nestjs/common';
import { SubscribersService } from '../services/subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async create(@Body('email') email: string) {
    return await this.subscribersService.create(email);
  }

  @Put()
  async updateByEmail(
    @Body('oldEmail') oldEmail: string,
    @Body('newEmail') newEmail: string,
  ) {
    return await this.subscribersService.updateByEmail(oldEmail, newEmail);
  }

  @Get()
  async findAll() {
    return await this.subscribersService.findAll();
  }

  @Delete()
  async deleteByEmail(@Body('email') email: string) {
    return await this.subscribersService.deleteByEmail(email);
  }
}
