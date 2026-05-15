import { Test, TestingModule } from '@nestjs/testing';
import { HomeConfigService } from './home-config.service';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('HomeConfigService', () => {
  let service: HomeConfigService;
  let prisma: PrismaService;

  const mockBanner = {
    id: 'banner-1',
    position: 'TOP',
    title: 'Test Banner',
    imageUrl: 'https://example.com/banner.jpg',
    link: null,
    sort: 0,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockFloor = {
    id: 'floor-1',
    title: '热门推荐',
    floorType: 'products',
    sort: 0,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tabs: [],
  };

  const mockTab = {
    id: 'tab-1',
    floorId: 'floor-1',
    name: '外观',
    imageUrl: null,
    targetType: '',
    targetId: null,
    sort: 0,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    items: [],
  };

  const mockTabItem = {
    id: 'item-1',
    floorTabId: 'tab-1',
    itemType: 'product',
    itemId: 'product-1',
    sort: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeConfigService,
        {
          provide: PrismaService,
          useValue: {
            banner: {
              findMany: jest.fn().mockResolvedValue([mockBanner]),
              findFirst: jest.fn().mockResolvedValue(mockBanner),
              create: jest.fn().mockResolvedValue(mockBanner),
              update: jest.fn().mockResolvedValue(mockBanner),
            },
            floor: {
              findMany: jest.fn().mockResolvedValue([mockFloor]),
              findFirst: jest.fn().mockResolvedValue(mockFloor),
              create: jest.fn().mockResolvedValue(mockFloor),
              update: jest.fn().mockResolvedValue(mockFloor),
            },
            floorTab: {
              findMany: jest.fn().mockResolvedValue([mockTab]),
              findFirst: jest.fn().mockResolvedValue(mockTab),
              create: jest.fn().mockResolvedValue(mockTab),
              update: jest.fn().mockResolvedValue(mockTab),
              delete: jest.fn().mockResolvedValue(mockTab),
            },
            floorTabItem: {
              findMany: jest.fn().mockResolvedValue([mockTabItem]),
              findUnique: jest.fn().mockResolvedValue(mockTabItem),
              create: jest.fn().mockResolvedValue(mockTabItem),
              update: jest.fn().mockResolvedValue(mockTabItem),
              delete: jest.fn().mockResolvedValue(mockTabItem),
              deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
              createMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: 'product-1', name: '镀晶', mainImages: null, priceDescription: '¥199起' },
              ]),
            },
            package: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeConfigService>(HomeConfigService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // ==================== Banner ====================

  describe('findBanners', () => {
    it('should return all banners without position filter', async () => {
      const result = await service.findBanners();
      expect(result).toEqual([mockBanner]);
      expect(prisma.banner.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { sort: 'asc' },
      });
    });

    it('should filter banners by position', async () => {
      await service.findBanners('TOP');
      expect(prisma.banner.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, position: 'TOP' },
        orderBy: { sort: 'asc' },
      });
    });
  });

  describe('findBanner', () => {
    it('should return a banner by id', async () => {
      const result = await service.findBanner('banner-1');
      expect(result).toEqual(mockBanner);
    });

    it('should throw NotFoundException if banner not found', async () => {
      jest.spyOn(prisma.banner, 'findFirst').mockResolvedValue(null);
      await expect(service.findBanner('invalid')).rejects.toThrow('Banner不存在');
    });
  });

  describe('createBanner', () => {
    it('should create a banner', async () => {
      const result = await service.createBanner({
        position: 'TOP',
        title: 'Test',
        imageUrl: 'https://example.com/img.jpg',
      });
      expect(result).toEqual(mockBanner);
    });
  });

  // ==================== Floor ====================

  describe('findFloors', () => {
    it('should return floors with tabs and items', async () => {
      const result = await service.findFloors();
      expect(result).toEqual([mockFloor]);
    });
  });

  describe('createFloor', () => {
    it('should create a floor', async () => {
      const result = await service.createFloor({ title: '热门推荐' });
      expect(result).toEqual(mockFloor);
    });
  });

  // ==================== FloorTab ====================

  describe('createFloorTab', () => {
    it('should create a tab after verifying floor exists', async () => {
      const result = await service.createFloorTab({ floorId: 'floor-1', name: '外观' });
      expect(result).toEqual(mockTab);
      expect(prisma.floor.findFirst).toHaveBeenCalled();
    });

    it('should throw if floor not found', async () => {
      jest.spyOn(prisma.floor, 'findFirst').mockResolvedValue(null);
      await expect(service.createFloorTab({ floorId: 'invalid', name: 'Tab' })).rejects.toThrow('楼层不存在');
    });
  });

  // ==================== FloorTabItem ====================

  describe('batchReplaceFloorTabItems', () => {
    it('should replace all items for a tab', async () => {
      const result = await service.batchReplaceFloorTabItems({
        floorTabId: 'tab-1',
        items: [
          { itemType: 'product', itemId: 'p1', sort: 0 },
          { itemType: 'product', itemId: 'p2', sort: 1 },
        ],
      });
      expect(prisma.floorTabItem.deleteMany).toHaveBeenCalledWith({
        where: { floorTabId: 'tab-1' },
      });
      expect(prisma.floorTabItem.createMany).toHaveBeenCalled();
      expect(result).toEqual([mockTabItem]);
    });
  });

  // ==================== Mini Home Config ====================

  describe('getMiniHomeConfig', () => {
    it('should return filtered and sorted home config', async () => {
      jest.spyOn(prisma.banner, 'findMany').mockResolvedValue([mockBanner]);
      jest.spyOn(prisma.floor, 'findMany').mockResolvedValue([
        {
          ...mockFloor,
          tabs: [{
            ...mockTab,
            items: [{
              ...mockTabItem,
              itemType: 'product',
              itemId: 'product-1',
            }],
          }],
        } as any,
      ]);

      const result = await service.getMiniHomeConfig();
      expect(result.topBanners).toHaveLength(1);
      expect(result.middleBanners).toHaveLength(1);
      expect(result.floors).toHaveLength(1);
      expect(result.floors[0]!.tabs[0]!.items[0]!.snapshot).toBeDefined();
      expect(result.floors[0]!.tabs[0]!.items[0]!.snapshot!.name).toBe('镀晶');
    });

    it('should filter out items referencing invalid products', async () => {
      jest.spyOn(prisma.banner, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.floor, 'findMany').mockResolvedValue([
        {
          ...mockFloor,
          tabs: [{
            ...mockTab,
            items: [{ ...mockTabItem, itemType: 'product', itemId: 'invalid-product' }],
          }],
        } as any,
      ]);
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue([]);

      const result = await service.getMiniHomeConfig();
      expect(result.floors).toHaveLength(0);
    });

    it('should return banners in DB sort order', async () => {
      const banners = [
        { ...mockBanner, id: 'b2', sort: 1 },
        { ...mockBanner, id: 'b1', sort: 2 },
      ];
      jest.spyOn(prisma.banner, 'findMany').mockResolvedValue(banners);
      jest.spyOn(prisma.floor, 'findMany').mockResolvedValue([]);

      const result = await service.getMiniHomeConfig();
      expect(result.topBanners[0].id).toBe('b2');
      expect(result.topBanners[1].id).toBe('b1');
    });
  });
});
