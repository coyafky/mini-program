import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { CreateFloorDto, UpdateFloorDto } from './dto/floor.dto';
import { CreateFloorTabDto, UpdateFloorTabDto } from './dto/floor-tab.dto';
import { CreateFloorTabItemDto, UpdateFloorTabItemDto, BatchReplaceFloorTabItemsDto } from './dto/floor-tab-item.dto';

@Injectable()
export class HomeConfigService {
  constructor(private prisma: PrismaService) {}

  // ==================== Banner ====================

  async findBanners(position?: string) {
    const where: any = { deletedAt: null };
    if (position) where.position = position;
    return this.prisma.banner.findMany({
      where,
      orderBy: { sort: 'asc' },
    });
  }

  async findBanner(id: string) {
    const banner = await this.prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });
    if (!banner) throw new NotFoundException('Banner不存在');
    return banner;
  }

  async createBanner(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: dto });
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    await this.findBanner(id);
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async removeBanner(id: string) {
    await this.findBanner(id);
    return this.prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== Floor ====================

  async findFloors() {
    return this.prisma.floor.findMany({
      where: { deletedAt: null },
      orderBy: { sort: 'asc' },
      include: {
        tabs: {
          where: { deletedAt: null },
          orderBy: { sort: 'asc' },
          include: {
            items: {
              orderBy: { sort: 'asc' },
            },
          },
        },
      },
    });
  }

  async findFloor(id: string) {
    const floor = await this.prisma.floor.findFirst({
      where: { id, deletedAt: null },
      include: {
        tabs: {
          where: { deletedAt: null },
          orderBy: { sort: 'asc' },
          include: {
            items: {
              orderBy: { sort: 'asc' },
            },
          },
        },
      },
    });
    if (!floor) throw new NotFoundException('楼层不存在');
    return floor;
  }

  async createFloor(dto: CreateFloorDto) {
    return this.prisma.floor.create({ data: dto });
  }

  async updateFloor(id: string, dto: UpdateFloorDto) {
    await this.findFloor(id);
    return this.prisma.floor.update({ where: { id }, data: dto });
  }

  async removeFloor(id: string) {
    await this.findFloor(id);
    return this.prisma.floor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== FloorTab ====================

  async findFloorTab(id: string) {
    const tab = await this.prisma.floorTab.findFirst({
      where: { id, deletedAt: null },
    });
    if (!tab) throw new NotFoundException('选块不存在');
    return tab;
  }

  async createFloorTab(dto: CreateFloorTabDto) {
    await this.findFloor(dto.floorId);
    return this.prisma.floorTab.create({ data: dto });
  }

  async updateFloorTab(id: string, dto: UpdateFloorTabDto) {
    await this.findFloorTab(id);
    return this.prisma.floorTab.update({ where: { id }, data: dto });
  }

  async removeFloorTab(id: string) {
    await this.findFloorTab(id);
    return this.prisma.floorTab.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== FloorTabItem ====================

  async findFloorTabItem(id: string) {
    const item = await this.prisma.floorTabItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('推荐项不存在');
    return item;
  }

  async createFloorTabItem(dto: CreateFloorTabItemDto) {
    await this.findFloorTab(dto.floorTabId);
    return this.prisma.floorTabItem.create({ data: dto });
  }

  async updateFloorTabItem(id: string, dto: UpdateFloorTabItemDto) {
    await this.findFloorTabItem(id);
    return this.prisma.floorTabItem.update({ where: { id }, data: dto });
  }

  async removeFloorTabItem(id: string) {
    await this.findFloorTabItem(id);
    return this.prisma.floorTabItem.delete({ where: { id } });
  }

  async batchReplaceFloorTabItems(dto: BatchReplaceFloorTabItemsDto) {
    await this.findFloorTab(dto.floorTabId);
    await this.prisma.floorTabItem.deleteMany({
      where: { floorTabId: dto.floorTabId },
    });
    const items = dto.items.map((item, index) => ({
      floorTabId: dto.floorTabId,
      itemType: item.itemType,
      itemId: item.itemId,
      sort: item.sort ?? index,
    }));
    await this.prisma.floorTabItem.createMany({ data: items });
    return this.prisma.floorTabItem.findMany({
      where: { floorTabId: dto.floorTabId },
      orderBy: { sort: 'asc' },
    });
  }

  // ==================== Mini home config ====================

  async getMiniHomeConfig() {
    const [topBanners, middleBanners, floors] = await Promise.all([
      this.prisma.banner.findMany({
        where: { deletedAt: null, status: 1, position: 'TOP' },
        orderBy: { sort: 'asc' },
      }),
      this.prisma.banner.findMany({
        where: { deletedAt: null, status: 1, position: 'MIDDLE' },
        orderBy: { sort: 'asc' },
      }),
      this.prisma.floor.findMany({
        where: { deletedAt: null, status: 1 },
        orderBy: { sort: 'asc' },
        include: {
          tabs: {
            where: { deletedAt: null, status: 1 },
            orderBy: { sort: 'asc' },
            include: {
              items: {
                orderBy: { sort: 'asc' },
              },
            },
          },
        },
      }),
    ]);

    const productIds = new Set<string>();
    const packageIds = new Set<string>();
    for (const floor of floors) {
      for (const tab of floor.tabs) {
        for (const item of tab.items) {
          if (item.itemType === 'product') productIds.add(item.itemId);
          else if (item.itemType === 'package') packageIds.add(item.itemId);
        }
      }
    }

    const [products, packages] = await Promise.all([
      productIds.size
        ? this.prisma.product.findMany({
            where: { id: { in: Array.from(productIds) }, deletedAt: null, status: 1 },
            select: { id: true, name: true, mainImages: true, priceDescription: true },
          })
        : Promise.resolve([]),
      packageIds.size
        ? this.prisma.package.findMany({
            where: { id: { in: Array.from(packageIds) }, deletedAt: null, status: 1 },
            select: { id: true, name: true, mainImages: true, price: true },
          })
        : Promise.resolve([]),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));
    const packageMap = new Map(packages.map((p) => [p.id, p]));

    const filteredFloors = floors
      .map((floor) => {
        const filteredTabs = floor.tabs
          .map((tab) => {
            const validItems = tab.items.filter((item) => {
              if (item.itemType === 'product') return productMap.has(item.itemId);
              if (item.itemType === 'package') return packageMap.has(item.itemId);
              return true;
            });
            if (validItems.length === 0) return null;
            return {
              id: tab.id,
              name: tab.name,
              imageUrl: tab.imageUrl,
              targetType: tab.targetType,
              targetId: tab.targetId,
              sort: tab.sort,
              items: validItems.map((item) => ({
                id: item.id,
                itemType: item.itemType,
                itemId: item.itemId,
                sort: item.sort,
                snapshot: item.itemType === 'product'
                  ? productMap.get(item.itemId)
                  : packageMap.get(item.itemId),
              })),
            };
          })
          .filter(Boolean);
        if (filteredTabs.length === 0) return null;
        return {
          id: floor.id,
          title: floor.title,
          floorType: floor.floorType,
          sort: floor.sort,
          tabs: filteredTabs,
        };
      })
      .filter(Boolean);

    return {
      topBanners,
      middleBanners,
      floors: filteredFloors,
    };
  }
}
