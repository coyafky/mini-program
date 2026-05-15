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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let StatsService = class StatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [totalReservations, pendingCount, contactedCount, confirmedCount, completedCount, closedCount, storeCount, productCount, packageCount,] = await Promise.all([
            this.prisma.reservation.count({ where }),
            this.prisma.reservation.count({ ...where, ...{ status: 'pending' } }),
            this.prisma.reservation.count({ ...where, ...{ status: 'contacted' } }),
            this.prisma.reservation.count({ ...where, ...{ status: 'confirmed' } }),
            this.prisma.reservation.count({ ...where, ...{ status: 'completed' } }),
            this.prisma.reservation.count({ ...where, ...{ status: 'closed' } }),
            this.prisma.store.count({ where: { deletedAt: null, status: 1 } }),
            this.prisma.product.count({ where: { deletedAt: null, status: 1 } }),
            this.prisma.package.count({ where: { deletedAt: null, status: 1 } }),
        ]);
        return {
            totalReservations,
            byStatus: {
                pending: pendingCount,
                contacted: contactedCount,
                confirmed: confirmedCount,
                completed: completedCount,
                closed: closedCount,
            },
            stores: storeCount,
            products: productCount,
            packages: packageCount,
        };
    }
    async getReservationTrend(days = 7) {
        const dates = [];
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);
            dates.push(dateStr);
            const count = await this.prisma.reservation.count({
                where: {
                    createdAt: {
                        gte: new Date(`${dateStr}T00:00:00Z`),
                        lt: new Date(`${dateStr}T23:59:59Z`),
                    },
                },
            });
            data.push(count);
        }
        return { dates, data };
    }
    async getStoreDistribution() {
        const stores = await this.prisma.store.findMany({
            where: { deletedAt: null, status: 1 },
            select: { id: true, name: true },
        });
        const distribution = await Promise.all(stores.map(async (store) => {
            const count = await this.prisma.reservation.count({
                where: { storeId: store.id },
            });
            return { name: store.name, count };
        }));
        return distribution;
    }
    async getFunnel() {
        const total = await this.prisma.reservation.count();
        const contacted = await this.prisma.reservation.count({
            where: { status: { in: ['contacted', 'confirmed', 'completed'] } },
        });
        const confirmed = await this.prisma.reservation.count({
            where: { status: { in: ['confirmed', 'completed'] } },
        });
        const completed = await this.prisma.reservation.count({
            where: { status: 'completed' },
        });
        return [
            { stage: '提交预约', count: total, rate: '100%' },
            { stage: '已联系', count: contacted, rate: total ? `${Math.round((contacted / total) * 100)}%` : '0%' },
            { stage: '已确认到店', count: confirmed, rate: total ? `${Math.round((confirmed / total) * 100)}%` : '0%' },
            { stage: '已完成', count: completed, rate: total ? `${Math.round((completed / total) * 100)}%` : '0%' },
        ];
    }
    async getTopProducts(limit = 10) {
        const products = await this.prisma.product.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true },
        });
        const productCounts = await Promise.all(products.map(async (product) => {
            const count = await this.prisma.reservation.count({
                where: { productId: product.id },
            });
            return { name: product.name, count };
        }));
        return productCounts
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map