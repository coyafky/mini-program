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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let StoresService = class StoresService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [list, total] = await Promise.all([
            this.prisma.store.findMany({
                where: { deletedAt: null },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.store.count({ where: { deletedAt: null } }),
        ]);
        return { list, total, page, pageSize };
    }
    async findActiveStores() {
        return this.prisma.store.findMany({
            where: { deletedAt: null, status: 1 },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const store = await this.prisma.store.findFirst({
            where: { id, deletedAt: null },
        });
        if (!store)
            throw new common_1.NotFoundException('门店不存在');
        return store;
    }
    async create(dto) {
        return this.prisma.store.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.store.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.store.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getStoreProducts(storeId, category) {
        const where = { storeId };
        if (category) {
            where.product = { category, status: 1, deletedAt: null };
        }
        const products = await this.prisma.storeProduct.findMany({
            where: { storeId, product: { status: 1, deletedAt: null } },
            include: { product: true },
        });
        const packages = await this.prisma.storePackage.findMany({
            where: { storeId, package: { status: 1, deletedAt: null } },
            include: { package: true },
        });
        return {
            products: products.map((sp) => sp.product),
            packages: packages.map((sp) => sp.package),
        };
    }
    async configureProducts(storeId, dto) {
        await this.findOne(storeId);
        await this.prisma.storeProduct.deleteMany({ where: { storeId } });
        await this.prisma.storePackage.deleteMany({ where: { storeId } });
        if (dto.productIds?.length) {
            await this.prisma.storeProduct.createMany({
                data: dto.productIds.map((productId) => ({ storeId, productId })),
            });
        }
        if (dto.packageIds?.length) {
            await this.prisma.storePackage.createMany({
                data: dto.packageIds.map((packageId) => ({ storeId, packageId })),
            });
        }
        return { message: '配置成功' };
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoresService);
//# sourceMappingURL=stores.service.js.map