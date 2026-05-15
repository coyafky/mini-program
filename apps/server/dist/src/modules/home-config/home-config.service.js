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
exports.HomePageConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let HomePageConfigService = class HomePageConfigService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConfig() {
        const configs = await this.prisma.homePageConfig.findMany();
        const result = {};
        for (const config of configs) {
            try {
                result[config.configKey] = JSON.parse(config.configValue);
            }
            catch {
                result[config.configKey] = config.configValue;
            }
        }
        return result;
    }
    async updateConfig(configKey, configValue) {
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
};
exports.HomePageConfigService = HomePageConfigService;
exports.HomePageConfigService = HomePageConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomePageConfigService);
//# sourceMappingURL=home-config.service.js.map