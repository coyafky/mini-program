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
exports.CarModelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const car_models_service_1 = require("./car-models.service");
let CarModelsController = class CarModelsController {
    constructor(carModelsService) {
        this.carModelsService = carModelsService;
    }
    findAll(brand) {
        return this.carModelsService.findAll(brand);
    }
    findBrands() {
        return this.carModelsService.findBrands();
    }
    findOne(id) {
        return this.carModelsService.findOne(id);
    }
    create(data) {
        return this.carModelsService.create(data);
    }
    update(id, data) {
        return this.carModelsService.update(id, data);
    }
    remove(id) {
        return this.carModelsService.remove(id);
    }
};
exports.CarModelsController = CarModelsController;
__decorate([
    (0, common_1.Get)('car-models'),
    (0, swagger_1.ApiOperation)({ summary: '获取车型列表' }),
    __param(0, (0, common_1.Query)('brand')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('car-models/brands'),
    (0, swagger_1.ApiOperation)({ summary: '获取所有品牌' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "findBrands", null);
__decorate([
    (0, common_1.Get)('car-models/:id'),
    (0, swagger_1.ApiOperation)({ summary: '获取车型详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('admin/car-models'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '新增车型' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('admin/car-models/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新车型' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/car-models/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '删除车型' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CarModelsController.prototype, "remove", null);
exports.CarModelsController = CarModelsController = __decorate([
    (0, swagger_1.ApiTags)('车型管理'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [car_models_service_1.CarModelsService])
], CarModelsController);
//# sourceMappingURL=car-models.controller.js.map