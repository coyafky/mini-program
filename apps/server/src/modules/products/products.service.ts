import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    brand?: string;
    carModel?: string;
    keyword?: string;
  }) {
    const { page = 1, pageSize = 20, category, keyword } = params;
    const skip = (page - 1) * pageSize;
    const where: any = { deletedAt: null };

    if (category) where.category = category;
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

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        carModelRelations: {
          include: { carModel: true },
        },
      },
    });
    if (!product) throw new NotFoundException('商品不存在');
    return product;
  }

  async create(dto: CreateProductDto) {
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

  async update(id: string, dto: UpdateProductDto) {
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
