import { HomePageConfigService } from './home-config.service';
export declare class HomeConfigController {
    private readonly homeConfigService;
    constructor(homeConfigService: HomePageConfigService);
    getConfig(): Promise<Record<string, any>>;
    updateConfig(key: string, value: any): Promise<{
        id: string;
        updatedAt: Date;
        configKey: string;
        configValue: string;
    }>;
    batchUpdate(body: Record<string, any>): Promise<{
        id: string;
        updatedAt: Date;
        configKey: string;
        configValue: string;
    }[]>;
}
