import { Controller, Get, Put, Body, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { UpdateUserProfileDto } from '../dtos/updateUserProfile.dto';
import { UserProfilesService } from '../services/user-profiles.service';

@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    const profile = await this.userProfilesService.findByUserId(userId);
    if (profile) {
      return profile;
    }
    return await this.userProfilesService.create(userId);
  }

  @Put(':userId')
  async updateByUserId(
    @Param('userId') userId: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    return await this.userProfilesService.updateByUserId(userId, data);
  }

  @Get()
  async findAll() {
    return await this.userProfilesService.findAll();
  }

  @Delete(':userId')
  async deleteByEmail(@Param('userId') userId: string) {
    return await this.userProfilesService.deleteByUserId(userId);
  }
}
