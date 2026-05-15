import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 微信登录
  async wechatLogin(code: string) {
    // TODO: 接入微信服务端API，用code换取openid
    // 开发阶段模拟登录
    const mockOpenid = `mock_openid_${Date.now()}`;

    let user = await this.prisma.user.findUnique({
      where: { wechatOpenid: mockOpenid },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wechatOpenid: mockOpenid,
          nickname: '微信用户',
        },
      });
    }

    const token = this.jwtService.sign({
      userId: user.id,
      type: 'user',
    });

    return { userId: user.id, token, isNewUser: !user.phone };
  }

  // 管理后台登录
  async adminLogin(username: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) throw new UnauthorizedException('账号或密码错误');

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) throw new UnauthorizedException('账号或密码错误');

    if (admin.status !== 1) throw new UnauthorizedException('账号已被禁用');

    const token = this.jwtService.sign({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
      type: 'admin',
    });

    return {
      userId: admin.id,
      username: admin.username,
      role: admin.role,
      token,
    };
  }

  // 解析token
  async validateUser(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException('token无效或已过期');
    }
  }
}
