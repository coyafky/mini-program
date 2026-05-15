<template>
  <view class="home-page">
    <!-- 顶部搜索栏 -->
    <view class="top-shell">
      <view class="search-bar" @click="goCategory()">
        <text class="search-icon">⌕</text>
        <text class="search-text">搜索商品</text>
      </view>
    </view>

    <!-- Banner 轮播 -->
    <swiper class="hero-banner" :indicator-dots="true" :autoplay="true" :interval="3500" :duration="500">
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <view class="banner-card" :style="{ background: banner.color || defaultBannerColor }">
          <view class="banner-copy">
            <text class="banner-brand">蓝辉轻改 | 品牌轻改主张</text>
            <text class="banner-title">{{ banner.text || '为美好车居生活而来' }}</text>
            <text class="banner-subtitle">{{ banner.subText || '热门项目、爆款套餐、门店服务一体化' }}</text>
          </view>
          <view class="banner-car"></view>
        </view>
      </swiper-item>
    </swiper>

    <!-- ========================
         Tab 切换区域
         ======================== -->
    <view class="tab-bar-wrap">
      <scroll-view class="tab-scroll" scroll-x enable-flex :scroll-left="scrollLeft" scroll-with-animation>
        <view class="tab-list">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: currentTab === tab.key }"
            @click="switchTab(tab.key)"
          >
            <text class="tab-label">{{ tab.name }}</text>
          </view>
          <!-- 滑块下划线 -->
          <view class="tab-indicator" :style="indicatorStyle"></view>
        </view>
      </scroll-view>
    </view>

    <!-- ========================
         Tab 内容区
         ======================== -->
    <view class="tab-content">
      <!-- 加载态 -->
      <block v-if="tabLoading">
        <view class="skeleton-grid">
          <view v-for="i in 4" :key="i" class="skeleton-card">
            <view class="skeleton-image"></view>
            <view class="skeleton-body">
              <view class="skeleton-line" style="width: 80%"></view>
              <view class="skeleton-line" style="width: 55%"></view>
              <view class="skeleton-line short" style="width: 40%"></view>
            </view>
          </view>
        </view>
      </block>

      <!-- 空态 -->
      <block v-else-if="currentContent.length === 0">
        <view class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无内容</text>
          <text class="empty-sub">看看其他分类吧</text>
        </view>
      </block>

      <!-- 内容 -->
      <block v-else>
        <view class="waterfall-grid">
          <view
            v-for="item in currentContent"
            :key="`${item.type}-${item.id}`"
            class="goods-card"
            @click="handleCardClick(item)"
          >
            <view class="goods-visual" :class="item.type">
              <text class="goods-corner">{{ item.type === 'package' ? '套餐' : item.type === 'case' ? '案例' : '商品' }}</text>
              <view class="goods-brand">蓝辉轻改</view>
              <image v-if="item.image" :src="item.image" mode="aspectFill" class="goods-image" @error="onImageError(item)" />
              <view v-else class="goods-placeholder">
                <text class="goods-placeholder-mark">{{ item.type === 'package' ? '套' : '品' }}</text>
              </view>
            </view>
            <view class="goods-body">
              <text class="goods-title">{{ item.name }}</text>
              <text class="goods-brief">{{ item.brief }}</text>
              <text class="goods-price">{{ item.priceLabel }}</text>
            </view>
          </view>
        </view>
      </block>
    </view>

    <!-- 底部快捷入口（series strip — 保留在 tab 下方） -->
    <view v-if="currentTab === 'recommend'" class="series-strip">
      <view
        v-for="(entry, index) in quickEntries"
        :key="entry.label"
        class="series-item"
        :class="{ active: index === 0 }"
        @click="goCategory(entry.category)"
      >
        <text class="series-title">{{ entry.label }}</text>
        <text v-if="entry.badge" class="series-subtitle">{{ entry.badge }}</text>
      </view>
    </view>

    <!-- 热门车型横条（仅推荐 tab 显示） -->
    <view v-if="currentTab === 'recommend'" class="benefit-strip">
      <text v-for="benefit in benefits" :key="benefit" class="benefit-item">{{ benefit }}</text>
    </view>

    <!-- 门店入口 -->
    <view class="store-tip" @click="goStore()">
      <view>
        <text class="store-tip-title">{{ currentStoreName || '选择门店后再提交预约单' }}</text>
        <text class="store-tip-subtitle">
          {{ currentStoreName ? '当前门店已同步到预约单，点击继续切换' : '先选门店，再将项目加入预约单' }}
        </text>
      </view>
      <text class="store-tip-action">门店</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getHomeConfig, getHomeTabContent } from '@/services/modules/home'
import { firstImage, priceText } from '@/utils/format'
import { homeBenefits, homeQuickEntries, mockProducts, mockPackages } from '@/utils/catalog'
import type { HomeBanner } from '@/types/entities'

const defaultBannerColor = 'linear-gradient(135deg, #861313 0%, #c62520 45%, #f16f36 100%)'

// ========================
// 状态
// ========================
const currentStoreName = ref('')
const benefits = homeBenefits
const quickEntries = homeQuickEntries

// Banner
const banners = ref<HomeBanner[]>([
  {
    text: '为美好车居生活而来',
    subText: '车型专属升级方案，门店施工与预约单流程统一收口',
    color: defaultBannerColor,
  },
  {
    text: '问界 / 理想 / 享界 热门升级',
    subText: '先看车型，再看项目和套餐，更接近参考小程序的信息架构',
    color: 'linear-gradient(135deg, #7c1212 0%, #ad1f1e 45%, #d6a05f 100%)',
  },
])

// ========================
// Tab 相关状态
// ========================
interface HomeTab {
  key: string
  name: string
}

const tabs = ref<HomeTab[]>([
  { key: 'recommend', name: '推荐' },
  { key: 'product', name: '商品' },
  { key: 'package', name: '套餐' },
  { key: 'case', name: '案例' },
])

type ContentItem = {
  id: string
  type: 'product' | 'package' | 'case'
  name: string
  brief: string
  priceLabel: string
  image?: string
}

const currentTab = ref('recommend')
const tabLoading = ref(false)
const tabContentMap = ref<Record<string, ContentItem[]>>({})
const tabIndicatorPos = ref(0)
const scrollLeft = ref(0)

// Mock 数据按 tab key
const mockTabData: Record<string, ContentItem[]> = {
  recommend: [
    ...mockProducts.slice(0, 2).map((item) => ({
      id: item.id,
      type: 'product' as const,
      name: item.name,
      brief: item.brief || item.description || '查看门店安装方案',
      priceLabel: priceText(item.priceDescription),
      image: firstImage(item.mainImages),
    })),
    ...mockPackages.map((item) => ({
      id: item.id,
      type: 'package' as const,
      name: item.name,
      brief: item.description || '查看套餐详情和组成',
      priceLabel: item.price ? `¥${item.price.toLocaleString()}` : '到店咨询',
      image: firstImage(item.mainImages),
    })),
  ],
  product: mockProducts.map((item) => ({
    id: item.id,
    type: 'product' as const,
    name: item.name,
    brief: item.brief || item.description || '查看门店安装方案',
    priceLabel: priceText(item.priceDescription),
    image: firstImage(item.mainImages),
  })),
  package: mockPackages.map((item) => ({
    id: item.id,
    type: 'package' as const,
    name: item.name,
    brief: item.description || '查看套餐详情和组成',
    priceLabel: item.price ? `¥${item.price.toLocaleString()}` : '到店咨询',
    image: firstImage(item.mainImages),
  })),
  case: [],
}

const currentContent = computed(() => {
  return tabContentMap.value[currentTab.value] || []
})

// Tab 下划线指示器样式
const indicatorStyle = computed(() => {
  const tabWidth = 72 // 每个 tab 宽度（px）
  return {
    width: `${tabWidth}px`,
    transform: `translateX(${tabIndicatorPos.value}px)`,
    transitionDuration: '0.3s',
  }
})

// ========================
// 方法
// ========================
function syncStore() {
  currentStoreName.value = uni.getStorageSync('currentStoreName') || ''
}

async function loadTabContent(tabKey: string) {
  if (tabContentMap.value[tabKey]) return // 已缓存

  tabLoading.value = true
  try {
    const data = (await getHomeTabContent(tabKey)) as any
    if (Array.isArray(data?.items) && data.items.length) {
      tabContentMap.value[tabKey] = data.items
    } else {
      // API 无数据时降级到 mock
      tabContentMap.value[tabKey] = mockTabData[tabKey] || []
    }
  } catch {
    // 接口失败降级到 mock
    tabContentMap.value[tabKey] = mockTabData[tabKey] || []
  } finally {
    tabLoading.value = false
  }
}

function updateIndicator(index: number) {
  const tabWidth = 72
  tabIndicatorPos.value = index * tabWidth

  // 滚动以保持当前 tab 可见
  const screenWidth = uni.getSystemInfoSync().screenWidth || 375
  const targetScrollLeft = Math.max(0, index * tabWidth - screenWidth / 2 + tabWidth / 2)
  scrollLeft.value = targetScrollLeft
}

async function switchTab(tabKey: string) {
  if (currentTab.value === tabKey) return
  currentTab.value = tabKey
  const index = tabs.value.findIndex((t) => t.key === tabKey)
  updateIndicator(index)
  await loadTabContent(tabKey)
}

function onImageError(item: ContentItem) {
  // 图片加载失败时清掉 src，让占位图显示
  item.image = undefined
}

async function loadHomeData() {
  try {
    const config = (await getHomeConfig()) as any
    if (Array.isArray(config?.banners) && config.banners.length) banners.value = config.banners
  } catch {
    // 使用默认 banner
  }
}

function goCategory(category?: string) {
  if (category) uni.setStorageSync('categoryLanding', category)
  else uni.removeStorageSync('categoryLanding')
  uni.switchTab({ url: '/pages/category/index' })
}

function goDetail(id: string, type: 'product' | 'package') {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}&type=${type}` })
}

function handleCardClick(item: ContentItem) {
  if (item.type === 'case') {
    // 案例 tab: 一期暂无详情页，暂不跳转
    return
  }
  goDetail(item.id, item.type)
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

// ========================
// 生命周期
// ========================
onLoad(() => {
  syncStore()
  loadHomeData()
  // 初始加载推荐 tab
  loadTabContent('recommend')
})

onShow(() => {
  syncStore()
})

// 监听 tab 切换，切换内容时自动加载
watch(currentTab, (key) => {
  loadTabContent(key)
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f3;
  padding-bottom: calc(28px + env(safe-area-inset-bottom));
}

/* ---- 搜索栏 ---- */
.top-shell {
  padding: 12px 16px;
  background: #ffffff;
}

.search-bar {
  height: 44px;
  border-radius: 999px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
}

.search-icon {
  color: #9b9b9b;
  font-size: 20px;
}

.search-text {
  color: #c1c1c1;
  font-size: 15px;
}

/* ---- Banner ---- */
.hero-banner {
  height: 384px;
}

.banner-card {
  height: 100%;
  padding: 22px 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ffffff;
  overflow: hidden;
}

.banner-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.banner-brand {
  font-size: 12px;
  opacity: 0.9;
}

.banner-title {
  margin-top: 18px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
}

.banner-subtitle {
  width: 76%;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.88;
}

.banner-car {
  height: 142px;
  margin: 0 auto 20px;
  width: 82%;
  border-radius: 28px 28px 0 0;
  background:
    radial-gradient(circle at 50% 20%, rgba(255,255,255,0.35), transparent 48%),
    linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
  position: relative;
}

.banner-car::before {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 0;
  height: 56px;
  border-radius: 56px 56px 12px 12px;
  background: linear-gradient(90deg, #7f1012 0%, #d73d35 55%, #99201b 100%);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
}

/* ---- Tab 切换区 ---- */
.tab-bar-wrap {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  position: relative;
  padding: 0 8px;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px 12px;
  position: relative;
  flex-shrink: 0;
}

.tab-label {
  font-size: 15px;
  font-weight: 600;
  color: #999999;
  transition: color 0.25s;
  position: relative;
  z-index: 2;
}

.tab-item.active .tab-label {
  color: #2c2c2c;
  font-weight: 700;
}

/* 下划线滑块 */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 8px;
  height: 3px;
  background: #d8a04a;
  border-radius: 3px 3px 0 0;
  z-index: 1;
}

/* ---- Tab 内容区 ---- */
.tab-content {
  min-height: 200px;
  padding: 16px;
}

/* 骨架屏 */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 12px;
}

.skeleton-card {
  border-radius: 22px;
  background: #ffffff;
  overflow: hidden;
}

.skeleton-image {
  height: 246px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  height: 12px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 空态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 10px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.6;
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  color: #666666;
}

.empty-sub {
  font-size: 13px;
  color: #999999;
}

/* ---- 商品卡片网格 ---- */
.waterfall-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 12px;
}

.goods-card {
  overflow: hidden;
  border-radius: 22px;
  background: #ffffff;
}

.goods-visual {
  position: relative;
  height: 246px;
  padding: 10px;
  background: linear-gradient(180deg, #3b5d52 0%, #183127 100%);
}

.goods-visual.package {
  background: linear-gradient(180deg, #54472b 0%, #1f1b13 100%);
}

.goods-corner {
  position: absolute;
  right: 10px;
  top: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255,255,255,0.92);
  color: #a2701f;
  font-size: 10px;
  z-index: 2;
}

.goods-brand {
  position: absolute;
  left: 16px;
  top: 14px;
  color: rgba(255,255,255,0.9);
  font-size: 12px;
  z-index: 2;
}

.goods-image,
.goods-placeholder {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  top: 44px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0.08));
}

.goods-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-placeholder-mark {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255,255,255,0.88);
  color: #9d6d1f;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-body {
  padding: 14px 14px 16px;
}

.goods-title {
  min-height: 48px;
  display: block;
  font-size: 14px;
  line-height: 1.45;
  color: #222222;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-brief {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  line-height: 1.45;
  color: #999999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.goods-price {
  display: block;
  margin-top: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #f04d2d;
}

/* ---- 快捷入口 ---- */
.series-strip {
  padding: 10px 14px 0;
  background: #ffffff;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.series-item {
  padding: 10px 2px 14px;
  text-align: center;
}

.series-item.active .series-title {
  color: #ff5b2c;
}

.series-item.active .series-subtitle {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ff5b2c;
  color: #ffffff;
}

.series-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #333333;
}

.series-subtitle {
  display: block;
  margin-top: 8px;
  font-size: 11px;
  color: #b2b2b2;
}

/* ---- 热门车型横条 ---- */
.benefit-strip {
  margin: 12px 16px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.benefit-item {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff4e8;
  color: #a96b29;
  font-size: 11px;
}

/* ---- 门店入口 ---- */
.store-tip {
  margin: 16px 16px 0;
  padding: 16px;
  border-radius: 20px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-tip-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #202020;
}

.store-tip-subtitle {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #8b8b8b;
}

.store-tip-action {
  min-width: 54px;
  height: 30px;
  border-radius: 999px;
  background: #111111;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
