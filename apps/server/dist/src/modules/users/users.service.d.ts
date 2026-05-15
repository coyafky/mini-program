import { PrismaService } from "../../common/prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        wechatOpenid: string | null;
        wechatUnionid: string | null;
        avatarUrl: string | null;
    }>;
    bindPhone(userId: string, phone: string): Promise<{
        id: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        wechatOpenid: string | null;
        wechatUnionid: string | null;
        avatarUrl: string | null;
    }>;
    updateProfile(userId: string, data: {
        nickname?: string;
        avatarUrl?: string;
    }): Promise<{
        id: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        wechatOpenid: string | null;
        wechatUnionid: string | null;
        avatarUrl: string | null;
    }>;
}
