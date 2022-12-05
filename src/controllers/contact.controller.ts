import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { ContactService } from '../services/contact.service';
import { CreateContactMessageDto } from '../dtos/createContactMessage.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() messageData: CreateContactMessageDto) {
    return await this.contactService.create(
      messageData.name,
      messageData.phoneNumber,
      messageData.email,
      messageData.subject,
      messageData.message,
    );
  }

  @Get()
  async findAll() {
    return await this.contactService.findAll();
  }

  @Delete()
  async deleteAll() {
    return await this.contactService.deleteAll();
  }
}
