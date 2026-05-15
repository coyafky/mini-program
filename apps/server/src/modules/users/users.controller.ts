import { Controller, Get, Put, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('用户')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user?.userId);
  }

  @Post('users/bind-phone')
  @ApiBearerAuth()
  @ApiOperation({ summary: '绑定手机号' })
  bindPhone(@Req() req: any, @Body('phone') phone: string) {
    return this.usersService.bindPhone(req.user?.userId, phone);
  }

  @Put('users/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  updateProfile(
    @Req() req: any,
    @Body() data: { nickname?: string; avatarUrl?: string },
  ) {
    return this.usersService.updateProfile(req.user?.userId, data);
  }
}
