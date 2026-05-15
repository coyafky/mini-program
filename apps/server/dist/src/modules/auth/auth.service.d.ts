import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../common/prisma/prisma.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    wechatLogin(code: string): Promise<{
        userId: string;
        token: string;
        isNewUser: boolean;
    }>;
    adminLogin(username: string, password: string): Promise<{
        userId: string;
        username: string;
        role: string;
        token: string;
    }>;
    validateUser(token: string): Promise<any>;
}
