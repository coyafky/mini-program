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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const order_no_1 = require("../../common/utils/order-no");
let ReservationsService = class ReservationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const orderNo = (0, order_no_1.generateOrderNo)();
        const reservation = await this.prisma.reservation.create({
            data: {
                orderNo,
                userId,
                storeId: dto.storeId,
                productId: dto.productId,
                packageId: dto.packageId,
                userPhone: dto.userPhone,
                carModel: dto.carModel,
                appointmentDate: new Date(dto.appointmentDate),
                timeSlot: dto.timeSlot,
                remark: dto.remark,
                status: 'pending',
            },
            include: {
                store: true,
                user: { select: { nickname: true, phone: true } },
            },
        });
        await this.prisma.reservationStatusLog.create({
            data: {
                reservationId: reservation.id,
                newStatus: 'pending',
                remark: '用户提交预约',
            },
        });
        return reservation;
    }
    async findMyReservations(userId, status) {
        const where = { userId };
        if (status)
            where.status = status;
        return this.prisma.reservation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                store: { select: { id: true, name: true, address: true, phone: true } },
            },
        });
    }
    async findMyReservation(userId, id) {
        const reservation = await this.prisma.reservation.findFirst({
            where: { id, userId },
            include: {
                store: { select: { id: true, name: true, address: true, phone: true, businessHours: true } },
                statusLogs: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!reservation)
            throw new common_1.NotFoundException('预约单不存在');
        return reservation;
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, status, storeId, startDate, endDate } = params;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (status)
            where.status = status;
        if (storeId)
            where.storeId = storeId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [list, total] = await Promise.all([
            this.prisma.reservation.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: { select: { id: true, name: true, phone: true } },
                    user: { select: { id: true, nickname: true, phone: true } },
                },
            }),
            this.prisma.reservation.count({ where }),
        ]);
        return { list, total, page, pageSize };
    }
    async findOne(id) {
        const reservation = await this.prisma.reservation.findFirst({
            where: { id },
            include: {
                store: true,
                user: { select: { id: true, nickname: true, phone: true, avatarUrl: true } },
                statusLogs: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!reservation)
            throw new common_1.NotFoundException('预约单不存在');
        return reservation;
    }
    async updateStatus(id, dto, operatorId) {
        const reservation = await this.findOne(id);
        const updated = await this.prisma.reservation.update({
            where: { id },
            data: {
                status: dto.status,
                handleRemark: dto.handleRemark,
            },
        });
        await this.prisma.reservationStatusLog.create({
            data: {
                reservationId: id,
                oldStatus: reservation.status,
                newStatus: dto.status,
                operatorId,
                remark: dto.handleRemark,
            },
        });
        return updated;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map