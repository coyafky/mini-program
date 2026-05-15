import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/create-package.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const pkg = await this.prisma.package.findFirst({
      where: { id, deletedAt: null },
      include: {
        packageProducts: { include: { product: true } },
        carModelRelations: { include: { carModel: true } },
      },
    });
    if (!pkg) throw new NotFoundException('套餐不存在');
    return pkg;
  }

  async create(dto: CreatePackageDto) {
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

  async update(id: string, dto: UpdatePackageDto) {
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.package.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
