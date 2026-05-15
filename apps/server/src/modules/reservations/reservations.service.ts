import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/create-reservation.dto';
import { generateOrderNo } from '@/common/utils/order-no';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  // 用户端：创建预约单
  async create(userId: string, dto: CreateReservationDto) {
    const orderNo = generateOrderNo();
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

    // 记录状态变更
    await this.prisma.reservationStatusLog.create({
      data: {
        reservationId: reservation.id,
        newStatus: 'pending',
        remark: '用户提交预约',
      },
    });

    return reservation;
  }

  // 用户端：查询自己的预约单列表
  async findMyReservations(userId: string, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;

    return this.prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { id: true, name: true, address: true, phone: true } },
      },
    });
  }

  // 用户端：查询预约单详情
  async findMyReservation(userId: string, id: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, userId },
      include: {
        store: { select: { id: true, name: true, address: true, phone: true, businessHours: true } },
        statusLogs: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!reservation) throw new NotFoundException('预约单不存在');
    return reservation;
  }

  // 后台：查询所有预约单
  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    storeId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, pageSize = 10, status, storeId, startDate, endDate } = params;
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (status) where.status = status;
    if (storeId) where.storeId = storeId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
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

  // 后台：查询预约单详情
  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id },
      include: {
        store: true,
        user: { select: { id: true, nickname: true, phone: true, avatarUrl: true } },
        statusLogs: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!reservation) throw new NotFoundException('预约单不存在');
    return reservation;
  }

  // 后台：更新预约单状态
  async updateStatus(id: string, dto: UpdateReservationStatusDto, operatorId: string) {
    const reservation = await this.findOne(id);

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: dto.status,
        handleRemark: dto.handleRemark,
      },
    });

    // 记录状态变更
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
}
