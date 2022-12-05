import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessagesRepository: Repository<ContactMessage>,
  ) {}

  async create(
    name: string,
    phoneNumber: string,
    email: string,
    subject: string,
    message: string,
  ) {
    const contactMessage = this.contactMessagesRepository.create({
      name,
      phoneNumber,
      email,
      subject,
      message,
    });
    await this.contactMessagesRepository.save(contactMessage);
    return { message: 'Message saved successfully' };
  }

  async findAll() {
    return await this.contactMessagesRepository.find();
  }

  async deleteAll() {
    const messages = await this.findAll();
    if (messages && messages.length > 0) {
      await this.contactMessagesRepository.remove(messages);
      return { message: 'Contact messages have been removed' };
    }
    return { message: "There's no contact message in DB" };
  }
}
