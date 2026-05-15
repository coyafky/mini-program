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
exports.CarModelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let CarModelsService = class CarModelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(brand) {
        const where = {};
        if (brand)
            where.brand = brand;
        return this.prisma.carModel.findMany({
            where,
            orderBy: [{ brand: 'asc' }, { model: 'asc' }],
        });
    }
    async findBrands() {
        const models = await this.prisma.carModel.findMany({
            select: { brand: true },
            distinct: ['brand'],
            orderBy: { brand: 'asc' },
        });
        return models.map((m) => m.brand);
    }
    async findOne(id) {
        const model = await this.prisma.carModel.findUnique({ where: { id } });
        if (!model)
            throw new common_1.NotFoundException('车型不存在');
        return model;
    }
    async create(data) {
        return this.prisma.carModel.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.carModel.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.carModel.delete({ where: { id } });
    }
};
exports.CarModelsService = CarModelsService;
exports.CarModelsService = CarModelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarModelsService);
//# sourceMappingURL=car-models.service.js.map