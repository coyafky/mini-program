import type { BookingCartItem, PackageItem, ProductItem, StoreItem } from '@/types/entities'

export const categoryConfigs = [
  {
    key: 'all',
    name: '推荐',
    desc: '品牌热销项目与人气套餐',
    heroTitle: '问界 M9 升级精选',
    heroSubtitle: '热门轻改项目一次配齐',
  },
  {
    key: 'exterior',
    name: '车身升级',
    desc: '隐形车衣、改色、外观件',
    heroTitle: '质感外观',
    heroSubtitle: '从漆面保护到整车风格焕新',
  },
  {
    key: 'interior',
    name: '内饰焕新',
    desc: '座椅、脚垫、方向盘包覆',
    heroTitle: '内饰细节',
    heroSubtitle: '舒适感和高级感同步提升',
  },
  {
    key: 'function',
    name: '功能升级',
    desc: '氛围灯、音响、智能配件',
    heroTitle: '智能体验',
    heroSubtitle: '把常用功能升级到位',
  },
  {
    key: 'comfort',
    name: '舒适配置',
    desc: '通风加热、电动尾门、隔热',
    heroTitle: '舒享出行',
    heroSubtitle: '围绕日常用车的高频体验优化',
  },
] as const

export const homeQuickEntries = [
  { label: '隐形车衣', category: 'exterior', badge: '热销' },
  { label: '改色膜', category: 'exterior', badge: '上新' },
  { label: '氛围灯', category: 'function', badge: '门店装' },
  { label: '航空软包', category: 'interior', badge: '口碑' },
  { label: '隔热膜', category: 'comfort', badge: '推荐' },
] as const

export const homeBenefits = ['品牌授权施工', '支持门店预约', '售后质保可查']

export const hotBrands = ['问界', '理想', '特斯拉', '小米 SU7', '蔚来', '极氪']

export const mockProducts: ProductItem[] = [
  {
    id: 'product-ppf',
    name: 'XPEL TPU 隐形车衣',
    priceDescription: '¥16800 起',
    brief: '亮度提升，自动修复，整车漆面保护',
    description: '采用进口 TPU 基材，覆盖高频用车场景的漆面防护需求。',
    category: 'exterior',
    tags: ['整车施工', '10 年质保'],
  },
  {
    id: 'product-wrap',
    name: '改色膜全车换色方案',
    priceDescription: '¥6980 起',
    brief: '热门颜色库存齐，支持门店实车比色',
    description: '适合整车风格焕新，支持高亮、哑光、金属等多种质感。',
    category: 'exterior',
    tags: ['热门颜色', '到店选色'],
  },
  {
    id: 'product-light',
    name: '64 色智能氛围灯',
    priceDescription: '¥3280 起',
    brief: '联动音乐与场景模式，提升座舱氛围感',
    description: '门店支持分区调试和安装演示，适配主流新能源车型。',
    category: 'function',
    tags: ['智能联动', '主流车型适配'],
  },
  {
    id: 'product-audio',
    name: '高保真音响升级',
    priceDescription: '¥4580 起',
    brief: '门店试听后再确定方案，包含基础调音服务',
    description: '兼顾人声和低频表现，适合日常通勤与长途场景。',
    category: 'function',
    tags: ['可试听', '专业调音'],
  },
  {
    id: 'product-seat',
    name: 'Nappa 真皮座椅包覆',
    priceDescription: '¥8800 起',
    brief: '触感细腻，支持配色与缝线定制',
    description: '从面料、缝线到版型都支持到店确认，适合内饰整体升级。',
    category: 'interior',
    tags: ['支持定制', '高级内饰'],
  },
  {
    id: 'product-mat',
    name: '航空软包脚垫',
    priceDescription: '¥1680 起',
    brief: '全包围覆盖，易打理，适合家庭用车',
    description: '按车型定制贴合，兼顾颜值和耐用度。',
    category: 'interior',
    tags: ['全包围', '耐污易清洁'],
  },
  {
    id: 'product-film',
    name: '高性能隔热防晒膜',
    priceDescription: '¥2980 起',
    brief: '降低暴晒闷热感，提升隐私和隔热表现',
    description: '针对日常暴晒和长途用车场景设计，支持多档透光选择。',
    category: 'comfort',
    tags: ['隔热防晒', '多档透光'],
  },
  {
    id: 'product-tailgate',
    name: '电动尾门升级',
    priceDescription: '¥2380 起',
    brief: '支持一键开启、防夹与高度记忆',
    description: '适合家庭与通勤高频装载场景，改善日常便利度。',
    category: 'comfort',
    tags: ['高度记忆', '一键开启'],
  },
]

export const mockPackages: PackageItem[] = [
  {
    id: 'package-exterior',
    name: '外观质感焕新套餐',
    price: 19800,
    description: '隐形车衣 + 镀铬黑化 + 玻璃冰甲，一次完成整车质感升级。',
    tags: ['旗舰热销', '整车焕新'],
    packageProducts: [
      { name: 'XPEL TPU 隐形车衣' },
      { name: '镀铬饰条黑化' },
      { name: '玻璃冰甲' },
    ],
  },
  {
    id: 'package-interior',
    name: '座舱舒享升级套餐',
    price: 11800,
    description: '座椅包覆 + 航空软包 + 氛围灯，让座舱体验更完整。',
    tags: ['到店体验', '舒适提升'],
    packageProducts: [
      { name: 'Nappa 真皮座椅包覆' },
      { name: '航空软包脚垫' },
      { name: '64 色智能氛围灯' },
    ],
  },
]

export const mockStores: StoreItem[] = [
  {
    id: 'store-guangzhou-1',
    name: '蓝辉轻改广州旗舰店',
    address: '广州市天河区黄埔大道西 188 号',
    phone: '020-12345678',
    businessHours: '09:00-20:00',
    status: 1,
  },
  {
    id: 'store-guangzhou-2',
    name: '蓝辉轻改海珠精选店',
    address: '广州市海珠区新港中路 397 号',
    phone: '020-22334455',
    businessHours: '09:30-19:30',
    status: 1,
  },
  {
    id: 'store-guangzhou-3',
    name: '蓝辉轻改番禺体验店',
    address: '广州市番禺区万博一路 95 号',
    phone: '020-55667788',
    businessHours: '10:00-19:00',
    status: 1,
  },
]

export const mineServiceEntries = [
  { key: 'reservations', label: '我的预约', icon: '预约' },
  { key: 'stores', label: '门店导航', icon: '门店' },
  { key: 'contact', label: '联系客服', icon: '客服' },
  { key: 'guide', label: '到店指南', icon: '指南' },
  { key: 'feedback', label: '意见反馈', icon: '反馈' },
  { key: 'about', label: '品牌介绍', icon: '品牌' },
] as const

export function getCategoryHero(category: string) {
  return categoryConfigs.find((item) => item.key === category) || categoryConfigs[0]
}

export function filterProductsByCategory(category: string) {
  if (!category || category === 'all') return mockProducts
  return mockProducts.filter((item) => item.category === category)
}

export function getHomeRecommendations() {
  return [...mockProducts.slice(0, 4), ...mockPackages.slice(0, 2)]
}

export function createCartItem(source: ProductItem | PackageItem, type: BookingCartItem['type']): BookingCartItem {
  const priceLabel =
    'price' in source && source.price !== undefined && source.price !== null
      ? `¥${source.price}`
      : 'priceDescription' in source
        ? source.priceDescription || '到店咨询'
        : '到店咨询'

  return {
    id: source.id,
    type,
    name: source.name,
    quantity: 1,
    priceLabel,
    brief: ('brief' in source ? source.brief : '') || source.description || '',
    category: 'category' in source ? source.category || null : null,
  }
}
