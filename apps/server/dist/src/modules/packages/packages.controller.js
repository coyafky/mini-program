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
exports.PackagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const packages_service_1 = require("./packages.service");
const create_package_dto_1 = require("./dto/create-package.dto");
let PackagesController = class PackagesController {
    constructor(packagesService) {
        this.packagesService = packagesService;
    }
    findAll(page = '1', pageSize = '10') {
        return this.packagesService.findAll(Number(page), Number(pageSize));
    }
    findOne(id) {
        return this.packagesService.findOne(id);
    }
    create(dto) {
        return this.packagesService.create(dto);
    }
    update(id, dto) {
        return this.packagesService.update(id, dto);
    }
    remove(id) {
        return this.packagesService.remove(id);
    }
};
exports.PackagesController = PackagesController;
__decorate([
    (0, common_1.Get)('packages'),
    (0, swagger_1.ApiOperation)({ summary: '获取套餐列表' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('packages/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取套餐详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('admin/packages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '新增套餐（后台）' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_package_dto_1.CreatePackageDto]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('admin/packages/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新套餐（后台）' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_package_dto_1.UpdatePackageDto]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/packages/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '删除套餐（软删除）' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "remove", null);
exports.PackagesController = PackagesController = __decorate([
    (0, swagger_1.ApiTags)('套餐管理'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [packages_service_1.PackagesService])
], PackagesController);
//# sourceMappingURL=packages.controller.js.map