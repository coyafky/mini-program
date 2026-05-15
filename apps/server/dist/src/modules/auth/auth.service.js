"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async wechatLogin(code) {
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
    async adminLogin(username, password) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { username },
        });
        if (!admin)
            throw new common_1.UnauthorizedException('账号或密码错误');
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('账号或密码错误');
        if (admin.status !== 1)
            throw new common_1.UnauthorizedException('账号已被禁用');
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
    async validateUser(token) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        }
        catch {
            throw new common_1.UnauthorizedException('token无效或已过期');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map