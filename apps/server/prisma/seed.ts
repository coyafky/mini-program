import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据初始化...');

  // 创建管理员账号
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      nickname: '超级管理员',
      role: 'super_admin',
    },
  });
  console.log(`管理员账号已创建: ${admin.username}`);

  // 创建示例门店
  const stores = [
    { name: '蓝辉轻改旗舰店', address: '上海市静安区南京西路1688号', phone: '021-58888888', businessHours: '9:00-20:00' },
    { name: '蓝辉轻改浦东店', address: '上海市浦东新区张杨路2389号', phone: '021-58889999', businessHours: '9:00-18:00' },
    { name: '蓝辉轻改宝山店', address: '上海市宝山区真大路450弄8号', phone: '021-56667777', businessHours: '10:00-19:00' },
  ];

  for (const storeData of stores) {
    const existing = await prisma.store.findFirst({
      where: { name: storeData.name, deletedAt: null },
    });
    if (!existing) {
      await prisma.store.create({ data: storeData });
    }
  }
  console.log(`已创建 ${stores.length} 个示例门店`);

  // 创建示例车型
  const carModels = [
    { brand: '问界', model: 'M5' },
    { brand: '问界', model: 'M7' },
    { brand: '问界', model: 'M8' },
    { brand: '问界', model: 'M9' },
    { brand: '理想', model: 'L6' },
    { brand: '理想', model: 'L7' },
    { brand: '理想', model: 'L8' },
    { brand: '理想', model: 'L9' },
    { brand: '小米', model: 'SU7' },
    { brand: '比亚迪', model: '汉' },
    { brand: '比亚迪', model: '唐' },
    { brand: '特斯拉', model: 'Model 3' },
    { brand: '特斯拉', model: 'Model Y' },
  ];

  for (const cm of carModels) {
    const existing = await prisma.carModel.findFirst({
      where: { brand: cm.brand, model: cm.model },
    });
    if (!existing) {
      await prisma.carModel.create({ data: cm });
    }
  }
  console.log(`已创建 ${carModels.length} 个示例车型`);

  // 创建示例商品
  const products = [
    { name: '隐形车衣 PPF', priceDescription: '¥6,800起', category: 'exterior', brief: '进口TPU材质，自动修复划痕' },
    { name: '隔热膜', priceDescription: '¥2,980起', category: 'exterior', brief: '高隔热率，紫外线阻隔99%' },
    { name: '真皮座椅改装', priceDescription: '¥4,500起', category: 'interior', brief: 'Nappa真皮，多种颜色可选' },
    { name: '氛围灯升级', priceDescription: '¥1,280起', category: 'interior', brief: '64色可调，手机APP控制' },
    { name: '电动尾门', priceDescription: '¥2,800起', category: 'comfort', brief: '智能电动开合，防夹功能' },
    { name: '360全景影像', priceDescription: '¥3,200起', category: 'function', brief: '高清摄像头，3D全景显示' },
    { name: '流媒体后视镜', priceDescription: '¥1,580起', category: 'function', brief: '前后双录，防眩目' },
    { name: '车载冰箱', priceDescription: '¥980起', category: 'comfort', brief: '压缩机制冷，车家两用' },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name, deletedAt: null },
    });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...p,
          mainImages: JSON.stringify(['https://via.placeholder.com/400x400?text=Product']),
          description: `${p.brief}。蓝辉轻改专业施工，品质保证。`,
        },
      });
    }
  }
  console.log(`已创建 ${products.length} 个示例商品`);

  console.log('种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
