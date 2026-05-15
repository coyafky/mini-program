import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CarModelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(brand?: string) {
    const where: any = {};
    if (brand) where.brand = brand;

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

  async findOne(id: string) {
    const model = await this.prisma.carModel.findUnique({ where: { id } });
    if (!model) throw new NotFoundException('车型不存在');
    return model;
  }

  async create(data: { brand: string; model: string; year?: string }) {
    return this.prisma.carModel.create({ data });
  }

  async update(id: string, data: { brand?: string; model?: string; year?: string }) {
    await this.findOne(id);
    return this.prisma.carModel.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.carModel.delete({ where: { id } });
  }
}
