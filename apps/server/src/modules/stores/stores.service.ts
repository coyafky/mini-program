import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto, StoreProductConfigDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const store = await this.prisma.store.findFirst({
      where: { id, deletedAt: null },
    });
    if (!store) throw new NotFoundException('门店不存在');
    return store;
  }

  async create(dto: CreateStoreDto) {
    return this.prisma.store.create({ data: dto });
  }

  async update(id: string, dto: UpdateStoreDto) {
    await this.findOne(id);
    return this.prisma.store.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // 获取门店商品（包含商品和套餐）
  async getStoreProducts(storeId: string, category?: string) {
    const where: any = { storeId };
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

  // 配置门店商品/套餐
  async configureProducts(storeId: string, dto: StoreProductConfigDto) {
    await this.findOne(storeId);

    // 清除旧配置
    await this.prisma.storeProduct.deleteMany({ where: { storeId } });
    await this.prisma.storePackage.deleteMany({ where: { storeId } });

    // 创建新配置
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
}
