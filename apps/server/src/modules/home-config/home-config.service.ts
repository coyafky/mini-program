import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class HomePageConfigService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const configs = await this.prisma.homePageConfig.findMany();
    const result: Record<string, any> = {};
    for (const config of configs) {
      try {
        result[config.configKey] = JSON.parse(config.configValue);
      } catch {
        result[config.configKey] = config.configValue;
      }
    }
    return result;
  }

  async updateConfig(configKey: string, configValue: any) {
    const existing = await this.prisma.homePageConfig.findUnique({
      where: { configKey },
    });

    const value = typeof configValue === 'string' ? configValue : JSON.stringify(configValue);

    if (existing) {
      return this.prisma.homePageConfig.update({
        where: { configKey },
        data: { configValue: value },
      });
    }

    return this.prisma.homePageConfig.create({
      data: { configKey, configValue: value },
    });
  }
}
