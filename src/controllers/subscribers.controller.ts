import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { SubscribersService } from '../services/subscribers.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { CreateSubscriberDto } from '../dtos/createSubscriber.dto';
import { UpdateSubscriberDto } from '../dtos/updateSubscriber.dto';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async create(@Body() subscriberData: CreateSubscriberDto) {
    return await this.subscribersService.create(subscriberData.email);
  }

  @Put(':email')
  async updateByEmail(
    @Param('email') email: string,
    @Body() data: UpdateSubscriberDto,
  ) {
    return await this.subscribersService.updateByEmail(email, data.newEmail);
  }

  @Get()
  async findAll() {
    return await this.subscribersService.findAll();
  }

  @Delete(':email')
  async deleteByEmail(@Param('email') email: string) {
    return await this.subscribersService.deleteByEmail(email);
  }
}
