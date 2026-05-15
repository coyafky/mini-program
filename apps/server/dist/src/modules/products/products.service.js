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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page = 1, pageSize = 20, category, keyword } = params;
        const skip = (page - 1) * pageSize;
        const where = { deletedAt: null };
        if (category)
            where.category = category;
        if (keyword) {
            where.OR = [
                { name: { contains: keyword } },
                { brief: { contains: keyword } },
            ];
        }
        const [list, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    carModelRelations: {
                        include: { carModel: true },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return { list, total, page, pageSize };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: {
                carModelRelations: {
                    include: { carModel: true },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('商品不存在');
        return product;
    }
    async create(dto) {
        const { carModelIds, ...data } = dto;
        const product = await this.prisma.product.create({ data });
        if (carModelIds?.length) {
            await this.prisma.productCarModelRelation.createMany({
                data: carModelIds.map((carModelId) => ({
                    productId: product.id,
                    carModelId,
                })),
            });
        }
        return this.findOne(product.id);
    }
    async update(id, dto) {
        await this.findOne(id);
        const { carModelIds, ...data } = dto;
        await this.prisma.product.update({ where: { id }, data });
        if (carModelIds !== undefined) {
            await this.prisma.productCarModelRelation.deleteMany({
                where: { productId: id },
            });
            if (carModelIds.length) {
                await this.prisma.productCarModelRelation.createMany({
                    data: carModelIds.map((carModelId) => ({
                        productId: id,
                        carModelId,
                    })),
                });
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map