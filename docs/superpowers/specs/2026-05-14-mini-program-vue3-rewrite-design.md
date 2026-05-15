# Mini Program Vue 3 Rewrite Design

**Date:** 2026-05-14

## Goal

在不改变后端业务契约的前提下，重写小程序端为 `uni-app + Vue 3 + Pinia + axios`，并基于参考截图对前端页面进行接近 1:1 的复刻。此次重写不只是技术迁移，还包括信息架构修正与视觉重建。

## Core Product Decision

当前小程序的核心问题不是单纯样式不佳，而是页面语义和参考产品不一致，尤其是“预约单”和“我的预约”被混用了。

本次重写确认采用以下产品结构：

- 底部导航固定为：
  - `首页`
  - `分类`
  - `门店`
  - `预约单`
  - `我的`
- `预约单` 是主 tab，对应参考产品中的“购物车”
- `我的预约` 从 `我的` 页进入，不再作为主 tab
- `预约详情` 只从 `我的预约` 进入

## Primary User Flow

主流程修正为：

1. 用户在首页、分类页或门店页浏览商品
2. 在商品详情页将商品加入 `预约单`
3. 进入 `预约单` 统一确认商品与门店
4. 从 `预约单` 进入提交预约页
5. 提交成功后进入 `我的预约`
6. 在 `我的预约` 中查看状态和详情

这意味着 `预约单` 是提交前的意向集合，而 `我的预约` 是提交后的历史记录，两者必须彻底拆开。

## Chosen Technical Approach

- 新建独立目录承载 Vue 3 重写版本
- 使用 Vue 3 uni-app 模板作为底座
- 使用 `Pinia` 管理全局状态
- 使用 `axios` 统一请求层
- 按业务模块重建目录
- 保留旧 `apps/mini-program` 作为迁移期对照，不在迁移过程中直接覆盖

## Why Rewrite Instead Of Patching

旧小程序存在结构性问题：

- 入口是 Vue 2 写法
- 依赖已切到 Vue 3
- 页面目录存在双轨结构
- 启动方式不匹配
- 当前页面视觉也与目标参考图偏差明显

继续在旧目录上修补会同时承担技术债和视觉返工，边际成本过高。独立重写能同时解决底座与页面表达的问题。

## Target Directory Structure

新目录采用业务模块结构：

- `src/pages/home`
- `src/pages/category`
- `src/pages/store`
- `src/pages/product`
- `src/pages/booking`
- `src/pages/mine`
- `src/stores`
- `src/services`
- `src/composables`
- `src/types`
- `src/utils`

## Runtime Stack

- `uni-app + Vite`
- `Vue 3`
- `Pinia`
- `axios`
- `TypeScript`

页面仍然通过 `pages.json` 配置路由，但路由语义会调整为新的页面结构：

- `home`
- `category`
- `store`
- `booking`
- `mine`

## State Design

全局状态拆成 3 个 store：

- `useUserStore`
  - 管理用户信息、登录态、token、持久化恢复
- `useStoreStore`
  - 管理当前门店、门店切换、门店本地缓存
- `useBookingStore`
  - 管理预约单内容、预约前临时意向数据、数量与清空逻辑

不再保留旧的 `this.$store` 兼容层。

## Service Design

请求层拆为两层：

- `src/services/http`
  - 创建 axios 实例
  - 统一 baseURL
  - 注入 token
  - 处理 401
  - 统一错误处理
- `src/services/modules/*`
  - `auth`
  - `home`
  - `store`
  - `product`
  - `reservation`
  - `user`

页面不再直接拼 URL，也不再保留旧的 `this.$api` 注入方式。

## Visual Recreation Strategy

### General Visual Language

整体风格按参考截图复刻：

- 大面积浅灰背景
- 白色圆角卡片
- 暖金色为主强调色
- 黑色或深灰标题文本
- 红橙色价格
- 轻阴影
- 强商品化电商布局

这意味着现有偏“通用后台风/轻信息页”的页面需要整体重画。

### Home Page

首页结构按截图复刻：

- 顶部浅灰搜索框
- 大红色品牌 Banner
- Banner 下方横向车型/套餐入口
- 双列商品卡流
- 强视觉商品封面

首页不是内容推荐流，而是商品化首页。

### Product Detail Page

商品详情页按截图复刻：

- 顶部 `商品 / 评价 / 详情` tab
- 详情主体以长图和图文说明为主
- 底部固定操作栏：
  - 左侧轻操作区
  - 中间 `加入预约单`
  - 右侧 `门店购买` / `立即预约`
- 保留规格/款式选择弹层预留结构

### Booking Page

`预约单` 页按参考“购物车”逻辑重做：

- 空态页：
  - 顶部保障文案
  - 空购物车插画占位
  - 热门推荐区
- 非空态页：
  - 预约商品清单
  - 数量修改
  - 删除
  - 当前门店
  - 底部汇总与提交预约按钮

### Store Selection Page

门店选择页按截图复刻：

- 顶部 `选择门店 / 常用门店` 双 tab
- 分类或区域筛选
- 搜索与地图入口
- 门店卡片右侧动作区：
  - `进店选购`
  - 电话
  - 导航
- 当前门店有高亮边框和选中角标

### Mine Page

个人页按截图复刻：

- 顶部金色背景
- 用户头像、昵称、手机号
- 会员卡视觉区
- 数据统计区
- 服务宫格区
- 将 `我的预约` 明确作为二级入口放入个人页

## Compatibility Boundaries

### Must Keep

- 后端 API 契约不变
- 当前业务功能边界不扩张
- 当前预约业务语义以“预约单/我的预约”拆分为准
- 本地缓存语义继续兼容：
  - `token`
  - `userInfo`
  - `currentStoreId`
  - `currentStoreName`
  - `currentStoreAddress`

### Will Change

- 小程序底部导航结构
- 页面目录结构
- 视觉样式实现
- 页面内部逻辑实现方式

## Explicit Non-Goals

- 本轮不接支付
- 不新增营销玩法
- 不改后台系统
- 不改后端整体业务模型
- 不在本轮内扩展复杂会员体系

## Main Risks

- 旧页面逻辑里“预约单”和“我的预约”仍有耦合，迁移时容易继续混淆
- 页面虽然会按截图复刻，但截图并不覆盖全部边缘态，需要补充合理空态与异常态
- 若只做视觉复刻不改底层逻辑，后续仍会继续失控

## Risk Controls

- 先修信息架构，再复刻页面
- 先完成公共层，再迁主链路页面
- 页面重做时以参考截图为主，PRD 为边界
- 对没有截图覆盖的状态，沿用同套视觉规范补齐

## Migration Order

1. 保留新 Vue 3 技术底座
2. 调整底部导航与页面路由语义
3. 重做 `预约单` 页面替换当前“我的预约”主 tab
4. 重做首页、商品详情、门店选择、个人页视觉结构
5. 调整 `我的预约` 入口位置与页面关系
6. 做主链路联调
7. 最后再处理其余边缘页面和细节

## Success Criteria

- 底部导航与参考产品一致
- `预约单` 与 `我的预约` 语义完全拆开
- 首页、商品详情、门店选择、个人页、预约单页面视觉接近参考截图
- 新 Vue 3 小程序目录可启动、可构建、可联调
- 旧目录不再作为后续开发基础
