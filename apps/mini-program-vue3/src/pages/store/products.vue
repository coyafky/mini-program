<template>
  <view class="store-products-page">
    <view class="store-hero">
      <view class="store-hero-top">
        <view class="hero-search">门店项目 / 热门套餐</view>
        <view class="hero-action" @click="goStoreIndex()">切店</view>
      </view>
      <text class="hero-name">{{ storeName }}</text>
      <text class="hero-address">{{ storeAddress || '门店项目将跟随当前门店展示' }}</text>
    </view>

    <view class="mode-row">
      <view class="mode-pill active">到店选购</view>
      <view class="mode-pill">顾问推荐</view>
    </view>

    <view class="content-wrap">
      <view class="left-menu">
        <view
          v-for="item in menuCategories"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeCategory === item.key }"
          @click="activeCategory = item.key"
        >
          {{ item.name }}
        </view>
      </view>

      <scroll-view scroll-y class="right-panel">
        <view class="section-block">
          <text class="section-title">当前分类</text>
          <text class="section-subtitle">{{ currentCategory?.desc || '热门门店项目' }}</text>
        </view>

        <view class="product-list">
          <view
            v-for="product in visibleProducts"
            :key="product.id"
            class="product-row"
            @click="goDetail(product.id, 'product')"
          >
            <image v-if="firstImage(product.mainImages)" :src="firstImage(product.mainImages)" mode="aspectFill" class="row-image" />
            <view v-else class="row-image placeholder">
              <text class="row-placeholder">{{ categoryAbbr(product.category) }}</text>
            </view>
            <view class="row-body">
              <text class="row-title">{{ product.name }}</text>
              <text class="row-brief">{{ product.brief || product.description }}</text>
              <text class="row-price">{{ priceText(product.priceDescription) }}</text>
            </view>
            <view class="add-btn" @click.stop="addProduct(product)">加单</view>
          </view>
        </view>

        <view v-if="showPackages.length" class="section-block package-block">
          <text class="section-title">门店套餐</text>
          <view class="package-list">
            <view
              v-for="pkg in showPackages"
              :key="pkg.id"
              class="package-card"
              @click="goDetail(pkg.id, 'package')"
            >
              <text class="package-name">{{ pkg.name }}</text>
              <text class="package-desc">{{ pkg.description }}</text>
              <view class="package-footer">
                <text class="package-price">{{ priceText(pkg.price) }}</text>
                <text class="package-link">查看详情</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="sticky-bar">
      <view class="sticky-meta" @click="goCart()">
        <text class="sticky-count">{{ totalCount }} 项</text>
        <text class="sticky-note">去预约单确认</text>
      </view>
      <button class="sticky-btn" @click="goCart()">预约单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getStoreProducts } from '@/services/modules/store'
import { useBookingStore } from '@/stores/booking'
import { categoryConfigs, createCartItem, mockPackages, mockProducts } from '@/utils/catalog'
import { firstImage, priceText } from '@/utils/format'
import type { PackageItem, ProductItem } from '@/types/entities'

const bookingStore = useBookingStore()

const storeId = ref('')
const storeName = ref('门店商品')
const storeAddress = ref('')
const activeCategory = ref<string>('all')
const products = ref<ProductItem[]>(mockProducts)
const packages = ref<PackageItem[]>(mockPackages)

const menuCategories = categoryConfigs
const currentCategory = computed(() => menuCategories.find((item) => item.key === activeCategory.value))
const visibleProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value
  return products.value.filter((item) => item.category === activeCategory.value)
})
const showPackages = computed(() => (activeCategory.value === 'all' ? packages.value : []))
const totalCount = computed(() => bookingStore.totalCount)

function categoryAbbr(category?: string | null) {
  const map: Record<string, string> = {
    exterior: '外',
    interior: '内',
    function: '能',
    comfort: '舒',
  }
  return category ? map[category] || '荐' : '荐'
}

async function loadStoreProducts() {
  try {
    if (!storeId.value) return
    const response = (await getStoreProducts(storeId.value)) as any
    products.value = response?.products?.length ? response.products : mockProducts
    packages.value = response?.packages?.length ? response.packages : mockPackages
  } catch {
    products.value = mockProducts
    packages.value = mockPackages
  }
}

function addProduct(product: ProductItem) {
  const payload = createCartItem(product, 'product')
  payload.image = firstImage(product.mainImages)
  bookingStore.addItem(payload)
  uni.showToast({ title: '已加入预约单', icon: 'none' })
}

function goDetail(id: string, type: 'product' | 'package') {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}&type=${type}` })
}

function goStoreIndex() {
  uni.switchTab({ url: '/pages/store/index' })
}

function goCart() {
  uni.switchTab({ url: '/pages/booking/cart' })
}

onLoad((options) => {
  bookingStore.restore()
  storeId.value = options?.storeId || uni.getStorageSync('currentStoreId') || ''
  storeName.value = decodeURIComponent(options?.storeName || uni.getStorageSync('currentStoreName') || '门店商品')
  storeAddress.value = uni.getStorageSync('currentStoreAddress') || ''
  loadStoreProducts()
})
</script>

<style lang="scss" scoped>
.store-products-page {
  min-height: 100vh;
  background: #f3f2ee;
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
}

.store-hero {
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f3f2ee 100%);
}

.store-hero-top {
  display: flex;
  gap: 10px;
}

.hero-search {
  flex: 1;
  height: 40px;
  border-radius: 999px;
  background: #f2efe8;
  color: #9a9387;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.hero-action {
  width: 64px;
  height: 40px;
  border-radius: 999px;
  background: #171717;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-name {
  display: block;
  margin-top: 16px;
  font-size: 22px;
  font-weight: 700;
  color: #171717;
}

.hero-address {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #7b7469;
}

.mode-row {
  padding: 0 16px;
  display: flex;
  gap: 10px;
}

.mode-pill {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ebe7df;
  color: #6d665a;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.mode-pill.active {
  background: #171717;
  color: #ffffff;
}

.content-wrap {
  margin-top: 14px;
  display: flex;
}

.left-menu {
  width: 88px;
  padding: 0 0 12px 12px;
}

.menu-item {
  padding: 15px 10px;
  border-radius: 18px 0 0 18px;
  color: #6f675c;
  font-size: 12px;
  text-align: center;
}

.menu-item.active {
  background: #ffffff;
  color: #171717;
  font-weight: 700;
}

.right-panel {
  flex: 1;
  height: calc(100vh - 220px);
  background: #ffffff;
  border-radius: 24px 0 0 24px;
  padding: 16px;
}

.section-block {
  margin-bottom: 14px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #171717;
}

.section-subtitle {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #80796d;
}

.product-list {
  display: grid;
  gap: 12px;
}

.product-row {
  display: grid;
  grid-template-columns: 92px 1fr 52px;
  gap: 12px;
}

.row-image {
  width: 92px;
  height: 92px;
  border-radius: 18px;
  background: linear-gradient(135deg, #efe8de 0%, #ddd4c7 100%);
}

.row-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-placeholder {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(139, 94, 26, 0.14);
  color: #8f5e16;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-body {
  min-width: 0;
}

.row-title {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #171717;
  line-height: 1.4;
}

.row-brief {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #7b7469;
}

.row-price {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #d44120;
}

.add-btn {
  align-self: end;
  width: 52px;
  height: 32px;
  border-radius: 999px;
  background: #171717;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.package-block {
  margin-top: 16px;
}

.package-list {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.package-card {
  padding: 16px;
  border-radius: 20px;
  background: #f8f6f1;
}

.package-name {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #171717;
}

.package-desc {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #7f786d;
}

.package-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.package-price {
  font-size: 15px;
  font-weight: 700;
  color: #d44120;
}

.package-link {
  font-size: 12px;
  color: #a16d25;
}

.sticky-bar {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  padding: 10px 10px 10px 16px;
  border-radius: 999px;
  background: #171717;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sticky-meta {
  min-width: 0;
}

.sticky-count {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.sticky-note {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
}

.sticky-btn {
  width: 104px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #d9b178 0%, #f0d3a4 100%);
  color: #3e2d15;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
