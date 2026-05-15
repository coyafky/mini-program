# 蓝辉轻改小程序

品牌预约到店型轻改装小程序 — 全栈解决方案

## 项目入口

**请先阅读** [docs/overview/项目导航.md](docs/overview/项目导航.md)，了解项目结构、术语和协作流程。

## 目录结构

```
docs/
├── overview/          # 项目入口导航、术语表、开发流程
├── requirements/      # 原始需求、参考资料
├── product/           # PRD、页面规格、开发任务清单
└── decisions/        # 关键决策记录

design/
├── prototypes/        # 原型（mini-program/、admin/）
└── specs/             # 设计规格

apps/
├── mini-program/      # uni-app 小程序 (Vue 2)
├── admin/             # 运营后台 (Vue 3 + Element Plus)
└── server/            # NestJS 后端 (TypeScript + Prisma + MySQL)

qa/                    # 测试计划、验收材料
release/               # 发布说明、上线检查项
ops/                   # 运营迭代记录
archive/               # 历史结构归档
```

## 技术栈

| 层 | 技术 |
|-----|--------|
| **前端小程序** | uni-app (Vue 2), SCSS |
| **后端** | NestJS 11, TypeScript, Prisma ORM, MySQL |
| **运营后台** | Vue 3, Element Plus, Vite, Pinia |
| **API 文档** | Swagger (OpenAPI) |

## 快速开始

### 1. 后端

```bash
cd apps/server

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库连接信息

# 生成 Prisma 客户端 & 推送 Schema
npx prisma generate
npx prisma db push

# 初始化种子数据
npx ts-node prisma/seed.ts

# 启动开发服务
pnpm start:dev
# API: http://localhost:3000/api/v1
# 文档: http://localhost:3000/api/docs
```

### 2. 小程序

```bash
cd apps/mini-program

# 安装依赖
pnpm install

# 使用 HBuilderX 打开项目目录
# 运行到微信开发者工具
```

### 3. 运营后台

```bash
cd apps/admin

# 安装依赖
pnpm install

# 启动开发服务
pnpm dev
# 访问: http://localhost:3001
```

## API 概览

| 模块 | 端点 | 说明 |
|---------|--------|------|
| 门店 | `/api/v1/stores` | 门店 CRUD 及活跃门店查询 |
| 商品 | `/api/v1/products` | 商品列表(分类/车型筛选) |
| 套餐 | `/api/v1/packages` | 套餐列表 |
| 预约单 | `/api/v1/reservations` | 用户预约 CRUD |
| 认证 | `/api/v1/auth` | 微信登录 / 管理后台登录 |
| 首页配置 | `/api/v1/home/config` | 首页动态配置 |
| 数据统计 | `/api/v1/admin/stats` | 概览/趋势/漏斗/排行 |

## 数据模型

- **Store** - 门店（含门店商品配置多对多关系）
- **Product** - 商品（车型适配关系）
- **Package** - 套餐（商品包含关系）
- **Reservation** - 预约单（含状态变更时间线）
- **User** - 微信用户
- **CarModel** - 车型字典
- **HomePageConfig** - 首页配置项
- **AdminUser** - 后台管理员

## 用户端页面

| 页面 | 功能要点 |
|-------|--------|
| 🏠 首页 | Banner 轮播、快捷入口、热门车型/商品/套餐、门店导航 |
| 📂 分类 | 左导航 + 商品网格，分类筛选、分页加载 |
| 🏪 门店 | 当前门店展示、门店列表选择、门店商品 Tab |
| 🛒 商品详情 | 图片画廊、规格参数、套餐包含、立即预约 |
| 📝 预约单提交 | 门店/项目/手机/车型/日期/时段 表单 |
| ✅ 预约成功 | 成功确认、温馨提示、查看预约 |
| 📋 我的预约 | 状态 Tab 筛选、预约卡片 |
| 📄 预约详情 | 状态卡片、预约信息、处理进度时间线 |
| 👤 我的 | 用户信息、快速入口、统计数据、菜单 |

## 后台页面

| 页面 | 功能 |
|-------|--------|
| 📊 概览 | 数据看板、待办事项、预约趋势 |
| 🏪 门店管理 | 门店 CRUD + 商品/套餐配置 |
| 📦 商品管理 | 商品 CRUD + 分类筛选 + 上下架 |
| 🎁 套餐管理 | 套餐 CRUD + 商品关联 |
| 📅 预约单管理 | 预约筛选、详情查看、状态流转 |
| ⚙️ 首页配置 | Banner/热门车型/商品/套餐 可视化配置 |
| 📈 数据统计 | 状态分布、门店分布、趋势、排行 |

## 开发命令

### 后端

| 命令 | 说明 |
|-------|------|
| `pnpm start:dev` | 热重载开发 |
| `pnpm build` | 编译 |
| `pnpm start:prod` | 生产运行 |
| `npx prisma studio` | 数据库管理界面 |
| `npx prisma migrate dev` | 数据库迁移 |
| `npx ts-node prisma/seed.ts` | 种子数据 |

### 后台

| 命令 | 说明 |
|-------|------|
| `pnpm dev` | 开发服务 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建结果 |

## 术语说明

- **预约单**：用户当前挑选但尚未提交的预约意向集合（页面名：预约单页）
- **我的预约**：用户已经提交成功的预约记录（页面名：我的预约页）

详见 [docs/overview/术语表.md](docs/overview/术语表.md)
