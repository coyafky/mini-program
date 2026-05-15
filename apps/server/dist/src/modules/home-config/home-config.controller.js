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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const home_config_service_1 = require("./home-config.service");
let HomeConfigController = class HomeConfigController {
    constructor(homeConfigService) {
        this.homeConfigService = homeConfigService;
    }
    getConfig() {
        return this.homeConfigService.getConfig();
    }
    updateConfig(key, value) {
        return this.homeConfigService.updateConfig(key, value);
    }
    async batchUpdate(body) {
        const results = [];
        for (const [key, value] of Object.entries(body)) {
            results.push(await this.homeConfigService.updateConfig(key, value));
        }
        return results;
    }
};
exports.HomeConfigController = HomeConfigController;
__decorate([
    (0, common_1.Get)('home/config'),
    (0, swagger_1.ApiOperation)({ summary: '获取首页配置（用户端）' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)('admin/home/config/:key'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新首页配置项（后台）' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HomeConfigController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Put)('admin/home/config'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '批量更新首页配置（后台）' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeConfigController.prototype, "batchUpdate", null);
exports.HomeConfigController = HomeConfigController = __decorate([
    (0, swagger_1.ApiTags)('首页配置'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [home_config_service_1.HomePageConfigService])
], HomeConfigController);
//# sourceMappingURL=home-config.controller.js.map