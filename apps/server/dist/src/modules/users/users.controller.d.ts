import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        wechatOpenid: string | null;
        wechatUnionid: string | null;
        avatarUrl: string | null;
    }>;
    bindPhone(req: any, phone: string): Promise<{
        id: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        wechatOpenid: string | null;
        wechatUnionid: string | null;
        avatarUrl: string | null;
    }>;
    updateProfile(req: any, data: {
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
