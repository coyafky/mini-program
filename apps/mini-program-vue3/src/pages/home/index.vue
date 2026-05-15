<template>
  <view class="home-page">
    <view class="top-shell">
      <view class="search-bar" @click="goCategory()">
        <text class="search-icon">⌕</text>
        <text class="search-text">搜索商品</text>
      </view>
    </view>

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

    <view class="series-strip">
      <view
        v-for="(entry, index) in quickEntries"
        :key="entry.label"
        class="series-item"
        :class="{ active: index === 0 }"
        @click="goCategory(entry.category)"
      >
        <text class="series-title">{{ entry.label }}</text>
        <text class="series-subtitle">{{ entry.badge }}</text>
      </view>
    </view>

    <view class="benefit-strip">
      <text v-for="benefit in benefits" :key="benefit" class="benefit-item">{{ benefit }}</text>
    </view>

    <view class="waterfall-grid">
      <view
        v-for="item in recommendationCards"
        :key="`${item.type}-${item.id}`"
        class="goods-card"
        @click="goDetail(item.id, item.type)"
      >
        <view class="goods-visual" :class="item.type">
          <text class="goods-corner">统一安装服务</text>
          <view class="goods-brand">蓝辉轻改</view>
          <image v-if="item.image" :src="item.image" mode="aspectFill" class="goods-image" />
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
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getHomeConfig } from '@/services/modules/home'
import { firstImage, priceText } from '@/utils/format'
import { getHomeRecommendations, homeBenefits, homeQuickEntries, mockPackages, mockProducts } from '@/utils/catalog'
import type { HomeBanner, PackageItem, ProductItem } from '@/types/entities'

const defaultBannerColor = 'linear-gradient(135deg, #861313 0%, #c62520 45%, #f16f36 100%)'

const currentStoreName = ref('')
const benefits = homeBenefits
const quickEntries = homeQuickEntries
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
const featuredProducts = ref<ProductItem[]>(mockProducts.slice(0, 4))
const featuredPackages = ref<PackageItem[]>(mockPackages)

const recommendationCards = computed(() => {
  const products = featuredProducts.value.map((item) => ({
    id: item.id,
    type: 'product' as const,
    name: item.name,
    brief: item.brief || item.description || '查看门店安装方案',
    priceLabel: priceText(item.priceDescription),
    image: firstImage(item.mainImages),
  }))
  const packages = featuredPackages.value.map((item) => ({
    id: item.id,
    type: 'package' as const,
    name: item.name,
    brief: item.description || '查看套餐详情和组成',
    priceLabel: priceText(item.price),
    image: firstImage(item.mainImages),
  }))
  return [...products, ...packages]
})

async function loadHomeData() {
  try {
    const config = (await getHomeConfig()) as any
    if (Array.isArray(config?.banners) && config.banners.length) banners.value = config.banners
    if (Array.isArray(config?.hotProducts) && config.hotProducts.length) featuredProducts.value = config.hotProducts
    if (Array.isArray(config?.hotPackages) && config.hotPackages.length) featuredPackages.value = config.hotPackages
  } catch {
    const fallback = getHomeRecommendations()
    featuredProducts.value = fallback.filter((item): item is ProductItem => 'priceDescription' in item)
    featuredPackages.value = fallback.filter((item): item is PackageItem => 'price' in item)
  }
}

function syncStore() {
  currentStoreName.value = uni.getStorageSync('currentStoreName') || ''
}

function goCategory(category?: string) {
  if (category) uni.setStorageSync('categoryLanding', category)
  else uni.removeStorageSync('categoryLanding')
  uni.switchTab({ url: '/pages/category/index' })
}

function goDetail(id: string, type: 'product' | 'package') {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}&type=${type}` })
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

onLoad(() => {
  syncStore()
  loadHomeData()
})

onShow(() => {
  syncStore()
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f3;
  padding-bottom: calc(28px + env(safe-area-inset-bottom));
}

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

.benefit-strip {
  margin: 12px 16px 0;
  display: flex;
  gap: 8px;
}

.benefit-item {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff4e8;
  color: #a96b29;
  font-size: 11px;
}

.waterfall-grid {
  padding: 16px;
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
}

.goods-brief {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  line-height: 1.45;
  color: #999999;
}

.goods-price {
  display: block;
  margin-top: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #f04d2d;
}

.store-tip {
  margin: 0 16px;
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
