import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-by-wechat')
  @ApiOperation({ summary: '微信登录' })
  wechatLogin(@Body('code') code: string) {
    if (!code) code = 'mock_code';
    return this.authService.wechatLogin(code);
  }

  @Post('admin/login')
  @ApiOperation({ summary: '管理员登录' })
  adminLogin(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.adminLogin(username, password);
  }
}
