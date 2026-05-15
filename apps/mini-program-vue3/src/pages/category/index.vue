<template>
  <view class="category-page">
    <view class="page-title">商品分类</view>
    <view class="search-wrap">
      <view class="search-box">点击搜索商品信息</view>
    </view>

    <view class="category-shell">
      <view class="sidebar">
        <scroll-view scroll-y class="sidebar-scroll">
          <view
            v-for="item in categories"
            :key="item.key"
            class="sidebar-item"
            :class="{ active: activeCategory === item.key }"
            @click="switchCategory(item.key)"
          >
            {{ item.name }}
          </view>
        </scroll-view>
      </view>

      <scroll-view scroll-y class="content-scroll">
        <view v-if="showPackages.length" class="block">
          <view class="block-header">
            <text class="block-accent">套餐权益包</text>
            <text class="block-title">套装权益包</text>
            <text class="block-arrow">›</text>
          </view>
          <view class="package-grid">
            <view
              v-for="pkg in showPackages"
              :key="pkg.id"
              class="package-item"
              @click="goDetail(pkg.id, 'package')"
            >
              <view class="package-thumb">
                <text class="package-thumb-mark">套</text>
              </view>
              <text class="package-name">{{ pkg.name }}</text>
            </view>
          </view>
        </view>

        <view class="block">
          <view class="block-header main-header">
            <text class="main-title">{{ currentHero.name }}</text>
            <text class="block-arrow">›</text>
          </view>
          <view class="model-grid">
            <view
              v-for="product in visibleProducts"
              :key="product.id"
              class="model-item"
              @click="goDetail(product.id, 'product')"
            >
              <view class="model-thumb">
                <text class="model-mark">{{ categoryAbbr(product.category) }}</text>
              </view>
              <text class="model-name">{{ product.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getProducts } from '@/services/modules/product'
import { categoryConfigs, filterProductsByCategory, getCategoryHero, mockPackages, mockProducts } from '@/utils/catalog'
import type { ProductItem } from '@/types/entities'

const categories = categoryConfigs
const activeCategory = ref<string>('all')
const productList = ref<ProductItem[]>(mockProducts)

const currentHero = computed(() => getCategoryHero(activeCategory.value))
const visibleProducts = computed(() => {
  if (activeCategory.value === 'all') return productList.value
  return productList.value.filter((item) => item.category === activeCategory.value)
})
const showPackages = computed(() => (activeCategory.value === 'all' ? mockPackages : []))

function categoryAbbr(category?: string | null) {
  const map: Record<string, string> = { exterior: 'M', interior: '座', function: '灯', comfort: '舒' }
  return category ? map[category] || '荐' : '荐'
}

function consumeLandingCategory() {
  const cached = uni.getStorageSync('categoryLanding')
  if (cached) {
    activeCategory.value = cached
    uni.removeStorageSync('categoryLanding')
  }
}

async function loadProducts() {
  try {
    const response = (await getProducts({ page: 1, pageSize: 50 })) as any
    if (Array.isArray(response?.list) && response.list.length) {
      productList.value = response.list
      return
    }
  } catch {
    // fallback below
  }
  productList.value = filterProductsByCategory('all')
}

function switchCategory(category: string) {
  activeCategory.value = category
}

function goDetail(id: string, type: 'product' | 'package') {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}&type=${type}` })
}

onLoad(() => {
  consumeLandingCategory()
  loadProducts()
})

onShow(() => {
  consumeLandingCategory()
})
</script>

<style lang="scss" scoped>
.category-page {
  min-height: 100vh;
  background: #ffffff;
}

.page-title {
  padding-top: 10px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #232323;
}

.search-wrap {
  padding: 18px 16px 14px;
}

.search-box {
  height: 52px;
  border-radius: 999px;
  background: #f5f5f5;
  color: #c7c7c7;
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.category-shell {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.sidebar {
  width: 114px;
  background: #f5f5f5;
}

.sidebar-scroll {
  height: calc(100vh - 120px);
}

.sidebar-item {
  min-height: 112px;
  padding: 18px 12px;
  display: flex;
  align-items: center;
  color: #404040;
  font-size: 18px;
  line-height: 1.25;
}

.sidebar-item.active {
  background: #ffffff;
  color: #dca04d;
  font-weight: 700;
}

.content-scroll {
  flex: 1;
  height: calc(100vh - 120px);
  padding: 12px 18px 30px;
}

.block + .block {
  margin-top: 18px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.block-accent {
  color: #dda14d;
  font-size: 14px;
  font-weight: 700;
}

.block-title,
.main-title {
  color: #333333;
  font-size: 17px;
  font-weight: 700;
}

.block-arrow {
  color: #9c9c9c;
  font-size: 22px;
  line-height: 1;
}

.main-header {
  margin-bottom: 18px;
}

.package-grid,
.model-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px 12px;
}

.package-item,
.model-item {
  text-align: center;
}

.package-thumb,
.model-thumb {
  height: 82px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f3f6fb 0%, #e7ebf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.package-thumb-mark,
.model-mark {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  color: #7b92c0;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.package-name,
.model-name {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.3;
  color: #383838;
}
</style>
