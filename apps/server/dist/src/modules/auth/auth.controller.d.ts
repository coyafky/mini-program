import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
