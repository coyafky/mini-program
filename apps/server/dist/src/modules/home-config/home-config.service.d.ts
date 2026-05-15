import { PrismaService } from "../../common/prisma/prisma.service";
export declare class HomePageConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    getConfig(): Promise<Record<string, any>>;
    updateConfig(configKey: string, configValue: any): Promise<{
        id: string;
        updatedAt: Date;
        configKey: string;
        configValue: string;
    }>;
}
