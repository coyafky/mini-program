<template>
  <view class="detail-page">
    <view class="detail-tabs">
      <text class="detail-tab">商品</text>
      <text class="detail-tab">评价</text>
      <text class="detail-tab active">详情</text>
    </view>

    <view class="detail-hero">
      <swiper class="gallery" :indicator-dots="images.length > 1" :autoplay="false">
        <swiper-item v-for="(image, index) in images" :key="index">
          <image :src="image" mode="aspectFill" class="gallery-image" />
        </swiper-item>
        <swiper-item v-if="!images.length">
          <view class="gallery-image placeholder">
            <text class="placeholder-mark">{{ isPackage ? '套' : '品' }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="summary-card">
      <text class="summary-price">{{ displayPrice }}</text>
      <text class="summary-title">{{ item.name || '商品详情' }}</text>
      <text class="summary-brief">{{ item.brief || item.description || '门店到店施工，支持顾问现场讲解方案' }}</text>
      <view class="tag-row">
        <text v-for="tag in tags" :key="tag" class="tag-chip">{{ tag }}</text>
      </view>
    </view>

    <view class="feature-strip">
      <text class="feature-title">软性释压</text>
      <text class="feature-subtitle">解压舒柔 奢柔支撑</text>
    </view>

    <view class="detail-block large-photo">
      <image v-if="images[0]" :src="images[0]" mode="aspectFill" class="detail-photo" />
      <view v-else class="detail-photo placeholder">
        <text class="placeholder-mark">{{ isPackage ? '套' : '品' }}</text>
      </view>
    </view>

    <view class="option-strip">
      <text class="option-chip">甄选皮革</text>
      <text class="option-chip">原车色系</text>
      <text class="option-chip">门店施工</text>
    </view>

    <view class="store-card" @click="goStore()">
      <view>
        <text class="store-card-title">{{ currentStoreName || '先选择门店，再确认方案' }}</text>
        <text class="store-card-subtitle">
          {{ currentStoreName ? '当前预约门店已同步，可继续切换' : '点击去门店页选择最近施工门店' }}
        </text>
      </view>
      <text class="store-card-action">换店</text>
    </view>

    <view class="detail-block">
      <text class="block-title">项目说明</text>
      <text class="block-copy">{{ item.description || defaultDescription }}</text>
    </view>

    <view v-if="specs.length" class="detail-block">
      <text class="block-title">规格参数</text>
      <view class="spec-list">
        <view v-for="(spec, index) in specs" :key="index" class="spec-item">
          <text class="spec-label">{{ spec.label }}</text>
          <text class="spec-value">{{ spec.value }}</text>
        </view>
      </view>
    </view>

    <view v-if="packageItems.length" class="detail-block">
      <text class="block-title">套餐包含</text>
      <view class="package-list">
        <view v-for="(entry, index) in packageItems" :key="index" class="package-entry">
          <text class="package-dot"></text>
          <text class="package-name">{{ packageItemName(entry) }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="mini-actions">
        <view class="mini-action" @click="goHome()">
          <text class="mini-icon">⌂</text>
          <text class="mini-label">首页</text>
        </view>
        <view class="mini-action">
          <text class="mini-icon">♡</text>
          <text class="mini-label">收藏</text>
        </view>
        <view class="mini-action" @click="goCart()">
          <text class="mini-icon">🛒</text>
          <text class="mini-label">预约单</text>
        </view>
      </view>
      <button class="cta dark" @click="addToCart()">加入预约单</button>
      <button class="cta gold" @click="buyNow()">门店购买</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getPackageDetail, getProductDetail } from '@/services/modules/product'
import { useBookingStore } from '@/stores/booking'
import { createCartItem, mockPackages, mockProducts } from '@/utils/catalog'
import { firstImage, imageList, parseJsonArray, priceText } from '@/utils/format'
import type { PackageItem, ProductItem } from '@/types/entities'

type SpecEntry = { label: string; value: string }

const defaultDescription = '到店后由顾问根据车型、使用场景和预算给出施工建议。'

const id = ref('')
const type = ref<'product' | 'package'>('product')
const item = ref<Partial<ProductItem & PackageItem>>({})
const images = ref<string[]>([])
const specs = ref<SpecEntry[]>([])
const packageItems = ref<Array<{ name?: string } | string>>([])
const currentStoreName = ref('')

const isPackage = computed(() => type.value === 'package')
const displayPrice = computed(() => (isPackage.value ? priceText(item.value.price) : priceText(item.value.priceDescription)))
const tags = computed(() => {
  const source = item.value.tags || []
  if (source.length) return source
  return isPackage.value ? ['门店套餐', '可到店调整'] : ['门店安装', '预约到店']
})

function syncStore() {
  currentStoreName.value = uni.getStorageSync('currentStoreName') || ''
}

function resolveFallbackItem() {
  return isPackage.value ? mockPackages.find((entry) => entry.id === id.value) || mockPackages[0] : mockProducts.find((entry) => entry.id === id.value) || mockProducts[0]
}

async function loadDetail() {
  try {
    const response = ((isPackage.value ? await getPackageDetail(id.value) : await getProductDetail(id.value)) || {}) as any
    item.value = response
  } catch {
    item.value = resolveFallbackItem()
  }

  images.value = imageList(item.value.mainImages)
  specs.value = parseJsonArray<SpecEntry>(item.value.specifications)
  packageItems.value = item.value.packageProducts?.map((entry) => ('product' in entry ? entry.product || entry : entry)) || []

  if (!specs.value.length && !isPackage.value) {
    specs.value = [
      { label: '施工周期', value: '1-2 天' },
      { label: '到店方式', value: '预约确认后施工' },
      { label: '售后保障', value: '门店可查' },
    ]
  }
}

function addToCart(showMessage = true) {
  const payload = createCartItem(item.value as ProductItem | PackageItem, type.value)
  payload.image = firstImage(item.value.mainImages)
  useBookingStore().addItem(payload)
  if (showMessage) uni.showToast({ title: '已加入预约单', icon: 'none' })
}

function packageItemName(entry: { name?: string } | string) {
  return typeof entry === 'string' ? entry : entry.name || ''
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}

function buyNow() {
  addToCart(false)
  uni.switchTab({ url: '/pages/booking/cart' })
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

function goCart() {
  uni.switchTab({ url: '/pages/booking/cart' })
}

onLoad((options) => {
  id.value = options?.id || ''
  type.value = (options?.type as 'product' | 'package') || 'product'
  syncStore()
  loadDetail()
})

onShow(() => {
  syncStore()
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: calc(94px + env(safe-area-inset-bottom));
}

.detail-tabs {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 42px;
  background: #ffffff;
}

.detail-tab {
  position: relative;
  color: #1f1f1f;
  font-size: 18px;
}

.detail-tab.active {
  color: #db9a48;
  font-weight: 700;
}

.detail-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -14px;
  height: 4px;
  border-radius: 999px;
  background: #db9a48;
}

.detail-hero {
  padding: 10px 0 0;
}

.gallery {
  height: 300px;
}

.gallery-image,
.detail-photo {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #eee5da 0%, #dbcab5 100%);
}

.gallery-image.placeholder,
.detail-photo.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-mark {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  color: #d3994d;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-card,
.store-card,
.detail-block {
  margin: 12px 16px 0;
  padding: 18px 16px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

.summary-price {
  display: block;
  color: #ea8f2f;
  font-size: 28px;
  font-weight: 700;
}

.summary-title {
  display: block;
  margin-top: 8px;
  color: #161616;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
}

.summary-brief {
  display: block;
  margin-top: 8px;
  color: #888888;
  font-size: 13px;
  line-height: 1.6;
}

.tag-row {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip,
.option-chip {
  padding: 7px 12px;
  border-radius: 999px;
  background: #f3e6d3;
  color: #b77f31;
  font-size: 12px;
}

.feature-strip {
  padding: 26px 16px 10px;
  text-align: center;
}

.feature-title {
  display: block;
  color: #da9a48;
  font-size: 28px;
  font-weight: 700;
}

.feature-subtitle {
  display: block;
  margin-top: 6px;
  color: #111111;
  font-size: 24px;
  font-weight: 700;
}

.large-photo {
  padding: 0;
  overflow: hidden;
}

.detail-photo {
  height: 470px;
}

.option-strip {
  margin: 14px 16px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.store-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-card-title {
  display: block;
  color: #1e1e1e;
  font-size: 15px;
  font-weight: 700;
}

.store-card-subtitle {
  display: block;
  margin-top: 6px;
  color: #8c8c8c;
  font-size: 12px;
}

.store-card-action {
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

.block-title {
  display: block;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 700;
}

.block-copy {
  display: block;
  margin-top: 12px;
  color: #555555;
  font-size: 13px;
  line-height: 1.8;
}

.spec-list {
  margin-top: 10px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f1f1;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label,
.spec-value,
.package-name {
  color: #444444;
  font-size: 13px;
}

.package-list {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.package-entry {
  display: flex;
  align-items: center;
  gap: 10px;
}

.package-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d59a48;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #ececec;
  padding: 10px 10px calc(10px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: 116px 1fr 1fr;
  gap: 0;
}

.mini-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
}

.mini-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mini-icon {
  color: #4a4a4a;
  font-size: 22px;
}

.mini-label {
  color: #666666;
  font-size: 11px;
}

.cta {
  height: 48px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta.dark {
  background: #1d1d1d;
  color: #ffffff;
  border-radius: 28px 0 0 28px;
}

.cta.gold {
  background: #e0a951;
  color: #ffffff;
  border-radius: 0 28px 28px 0;
}
</style>
