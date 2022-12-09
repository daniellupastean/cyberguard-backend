import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from '../dtos/updateUserProfile.dto';
import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfilesRepository: Repository<UserProfile>,
  ) {}

  async create(userId: string) {
    const userProfile = this.userProfilesRepository.create({
      userId,
    });
    return await this.userProfilesRepository.save(userProfile);
  }

  async updateByUserId(userId: string, profileData: UpdateUserProfileDto) {
    const userProfile = await this.findByUserId(userId);
    if (!userProfile) return { message: 'User profile not found' };
    return await this.userProfilesRepository.save({ userId, ...profileData });
  }

  async findByUserId(userId: string) {
    return await this.userProfilesRepository.findOneBy({ userId });
  }

  async findAll() {
    return await this.userProfilesRepository.find();
  }

  async deleteByUserId(userId: string) {
    const userProfile = await this.findByUserId(userId);
    if (!userProfile) return { message: 'User prfile does not exist' };
    return await this.userProfilesRepository.delete({ userId });
  }
}
