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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let PackagesService = class PackagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [list, total] = await Promise.all([
            this.prisma.package.findMany({
                where: { deletedAt: null },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    packageProducts: { include: { product: true } },
                    carModelRelations: { include: { carModel: true } },
                },
            }),
            this.prisma.package.count({ where: { deletedAt: null } }),
        ]);
        return { list, total, page, pageSize };
    }
    async findOne(id) {
        const pkg = await this.prisma.package.findFirst({
            where: { id, deletedAt: null },
            include: {
                packageProducts: { include: { product: true } },
                carModelRelations: { include: { carModel: true } },
            },
        });
        if (!pkg)
            throw new common_1.NotFoundException('套餐不存在');
        return pkg;
    }
    async create(dto) {
        const { productIds, carModelIds, price, ...data } = dto;
        const pkg = await this.prisma.package.create({
            data: {
                ...data,
                price: price ?? undefined,
            },
        });
        if (productIds?.length) {
            await this.prisma.packageProduct.createMany({
                data: productIds.map((productId) => ({
                    packageId: pkg.id,
                    productId,
                })),
            });
        }
        if (carModelIds?.length) {
            await this.prisma.packageCarModelRelation.createMany({
                data: carModelIds.map((carModelId) => ({
                    packageId: pkg.id,
                    carModelId,
                })),
            });
        }
        return this.findOne(pkg.id);
    }
    async update(id, dto) {
        await this.findOne(id);
        const { productIds, carModelIds, price, ...data } = dto;
        await this.prisma.package.update({
            where: { id },
            data: { ...data, price: price ?? undefined },
        });
        if (productIds !== undefined) {
            await this.prisma.packageProduct.deleteMany({ where: { packageId: id } });
            if (productIds.length) {
                await this.prisma.packageProduct.createMany({
                    data: productIds.map((productId) => ({ packageId: id, productId })),
                });
            }
        }
        if (carModelIds !== undefined) {
            await this.prisma.packageCarModelRelation.deleteMany({
                where: { packageId: id },
            });
            if (carModelIds.length) {
                await this.prisma.packageCarModelRelation.createMany({
                    data: carModelIds.map((carModelId) => ({
                        packageId: id,
                        carModelId,
                    })),
                });
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.package.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map