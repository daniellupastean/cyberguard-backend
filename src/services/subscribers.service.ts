import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscribersRepository: Repository<Subscriber>,
  ) {}

  async create(email: string) {
    const existingSubscriber = await this.findByEmail(email);
    if (existingSubscriber) return { message: 'Subscriber already exists' };
    const subscriber = this.subscribersRepository.create({
      email,
    });
    await this.subscribersRepository.save(subscriber);
    return { message: 'Subscribed successfully' };
  }

  async updateByEmail(oldEmail, newEmail) {
    const subscriber = await this.findByEmail(oldEmail);
    if (!subscriber) return { message: 'Subscriber not found' };
    subscriber.email = newEmail;
    await this.subscribersRepository.update(subscriber.id, subscriber);
    return { message: 'Subscriber updated successfully' };
  }

  async findByEmail(email: string) {
    return await this.subscribersRepository.findOneBy({ email });
  }

  async findAll() {
    return await this.subscribersRepository.find();
  }

  async deleteByEmail(email: string) {
    const subscriber = await this.findByEmail(email);
    if (!subscriber) return { message: 'Subscriber does not exist' };
    await this.subscribersRepository.delete({ email });
    return { message: 'Subscriber successfully deleted' };
  }
}
