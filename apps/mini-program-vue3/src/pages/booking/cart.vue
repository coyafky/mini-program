<template>
  <view class="cart-page">
    <view class="page-title">预约单</view>

    <view class="promise-bar">
      <text class="promise-item">100% 正品保证</text>
      <text class="promise-item">所有商品精选细选</text>
      <text class="promise-item">售后无忧</text>
    </view>

    <view class="count-row">
      <text class="count-number">{{ totalCount }}</text>
      <text class="count-label">预约数量</text>
    </view>

    <view v-if="cartItems.length" class="cart-content">
      <view class="store-card" @click="goStore()">
        <view>
          <text class="store-title">{{ currentStoreName || '请选择预约门店' }}</text>
          <text class="store-subtitle">
            {{ currentStoreName ? '预约单将提交给当前门店' : '提交前需要先选择门店' }}
          </text>
        </view>
        <text class="store-action">{{ currentStoreName ? '切换' : '去选' }}</text>
      </view>

      <view class="item-list">
        <view v-for="entry in cartItems" :key="`${entry.type}-${entry.id}`" class="item-card">
          <image v-if="entry.image" :src="entry.image" mode="aspectFill" class="item-image" />
          <view v-else class="item-image placeholder">
            <text class="placeholder-mark">{{ entry.type === 'package' ? '套' : '项' }}</text>
          </view>

          <view class="item-body">
            <text class="item-title">{{ entry.name }}</text>
            <text class="item-brief">{{ entry.brief || '门店到店确认施工方案' }}</text>
            <view class="item-footer">
              <text class="item-price">{{ entry.priceLabel || '到店咨询' }}</text>
              <view class="qty-box">
                <text class="qty-btn" @click="changeQty(entry.id, entry.type, entry.quantity - 1)">-</text>
                <text class="qty-value">{{ entry.quantity }}</text>
                <text class="qty-btn" @click="changeQty(entry.id, entry.type, entry.quantity + 1)">+</text>
              </view>
            </view>
          </view>

          <text class="delete-btn" @click="removeItem(entry.id, entry.type)">删除</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-wrap">
      <view class="empty-illustration">
        <view class="empty-box"></view>
        <view class="empty-cloud cloud-a"></view>
        <view class="empty-cloud cloud-b"></view>
      </view>
      <text class="empty-title">暂无商品，去添加点什么吧</text>
    </view>

    <view class="recommend-divider">
      <view class="divider-line"></view>
      <text class="divider-title">热门推荐</text>
      <view class="divider-line"></view>
    </view>

    <view class="recommend-panel">
      <view class="recommend-grid">
        <view
          v-for="product in recommendations"
          :key="product.id"
          class="recommend-card"
          @click="goDetail(product.id)"
        >
          <view class="recommend-image">
            <text class="recommend-mark">{{ categoryAbbr(product.category) }}</text>
          </view>
          <text class="recommend-name">{{ product.name }}</text>
          <text class="recommend-price">{{ priceText(product.priceDescription) }}</text>
        </view>
      </view>
    </view>

    <view class="checkout-bar">
      <view class="checkout-meta">
        <text class="checkout-count">共 {{ totalCount }} 项</text>
        <text class="checkout-note">{{ currentStoreName || '待选择门店' }}</text>
      </view>
      <button class="checkout-btn" @click="goSubmit()">提交预约</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useBookingStore } from '@/stores/booking'
import { mockProducts } from '@/utils/catalog'
import { priceText } from '@/utils/format'
import type { BookingItemType } from '@/types/entities'

const bookingStore = useBookingStore()
const currentStoreName = ref('')

const cartItems = computed(() => bookingStore.items)
const totalCount = computed(() => bookingStore.totalCount)
const recommendations = computed(() => mockProducts.slice(0, 4))

function syncState() {
  bookingStore.restore()
  currentStoreName.value = uni.getStorageSync('currentStoreName') || ''
}

function categoryAbbr(category?: string | null) {
  const map: Record<string, string> = { exterior: '外', interior: '内', function: '能', comfort: '舒' }
  return category ? map[category] || '荐' : '荐'
}

function changeQty(id: string, type: BookingItemType, quantity: number) {
  bookingStore.updateQuantity(id, type, quantity)
}

function removeItem(id: string, type: BookingItemType) {
  bookingStore.removeItem(id, type)
  uni.showToast({ title: '已移除项目', icon: 'none' })
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}&type=product` })
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

function goSubmit() {
  if (!cartItems.value.length) {
    uni.showToast({ title: '请先添加预约项目', icon: 'none' })
    return
  }
  if (!currentStoreName.value) {
    uni.showToast({ title: '请先选择门店', icon: 'none' })
    setTimeout(() => goStore(), 300)
    return
  }
  uni.navigateTo({ url: '/pages/booking/submit' })
}

onLoad(() => {
  syncState()
})

onShow(() => {
  syncState()
})
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.page-title {
  padding-top: 10px;
  text-align: center;
  color: #262626;
  font-size: 22px;
  font-weight: 700;
}

.promise-bar {
  margin-top: 14px;
  padding: 14px 16px;
  background: #f0f0f0;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.promise-item {
  color: #8f8f8f;
  font-size: 11px;
}

.count-row {
  padding: 18px 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.count-number {
  color: #d99c45;
  font-size: 18px;
}

.count-label {
  color: #303030;
  font-size: 20px;
  font-weight: 700;
}

.cart-content,
.recommend-panel {
  margin: 14px 16px 0;
}

.store-card,
.item-card,
.recommend-panel {
  background: #ffffff;
  border-radius: 22px;
}

.store-card {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-title {
  display: block;
  color: #202020;
  font-size: 15px;
  font-weight: 700;
}

.store-subtitle {
  display: block;
  margin-top: 6px;
  color: #8e8e8e;
  font-size: 12px;
}

.store-action {
  min-width: 48px;
  height: 30px;
  border-radius: 999px;
  background: #141414;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-list {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.item-card {
  padding: 14px;
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 12px;
  position: relative;
}

.item-image {
  width: 96px;
  height: 96px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f1f3f7 0%, #e4e7ec 100%);
}

.item-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-mark {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  color: #d39a4a;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-body {
  min-width: 0;
}

.item-title {
  display: block;
  padding-right: 44px;
  color: #232323;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.item-brief {
  display: block;
  margin-top: 8px;
  color: #909090;
  font-size: 12px;
  line-height: 1.5;
}

.item-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  color: #f04d2d;
  font-size: 15px;
  font-weight: 700;
}

.qty-box {
  min-width: 84px;
  height: 32px;
  border-radius: 999px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.qty-btn,
.qty-value {
  color: #333333;
  font-size: 13px;
}

.delete-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  color: #a98352;
  font-size: 12px;
}

.empty-wrap {
  padding: 28px 0 12px;
}

.empty-illustration {
  position: relative;
  height: 270px;
}

.empty-box {
  position: absolute;
  left: 50%;
  top: 78px;
  width: 118px;
  height: 82px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #efefef 0%, #dcdcdc 100%);
  clip-path: polygon(18% 20%, 82% 20%, 100% 46%, 76% 100%, 24% 100%, 0 46%);
}

.empty-cloud {
  position: absolute;
  border-radius: 999px;
  background: #efefef;
}

.cloud-a {
  left: calc(50% - 10px);
  top: 46px;
  width: 68px;
  height: 28px;
}

.cloud-b {
  left: calc(50% + 62px);
  top: 102px;
  width: 52px;
  height: 22px;
}

.empty-title {
  display: block;
  text-align: center;
  color: #9f9f9f;
  font-size: 18px;
  font-weight: 600;
}

.recommend-divider {
  margin: 18px 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #494949;
  opacity: 0.45;
}

.divider-title {
  color: #333333;
  font-size: 18px;
  font-weight: 700;
}

.recommend-panel {
  padding: 16px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.recommend-card {
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
}

.recommend-image {
  height: 128px;
  background: linear-gradient(180deg, #f1f3f7 0%, #e4e7ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommend-mark {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  color: #d39a4a;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommend-name {
  display: block;
  min-height: 40px;
  padding: 12px 12px 0;
  color: #232323;
  font-size: 13px;
  line-height: 1.45;
}

.recommend-price {
  display: block;
  padding: 8px 12px 14px;
  color: #f04d2d;
  font-size: 15px;
  font-weight: 700;
}

.checkout-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #ececec;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkout-count {
  display: block;
  color: #212121;
  font-size: 15px;
  font-weight: 700;
}

.checkout-note {
  display: block;
  margin-top: 4px;
  color: #8f8f8f;
  font-size: 12px;
}

.checkout-btn {
  width: 132px;
  height: 46px;
  border-radius: 999px;
  border: none;
  background: #e0a951;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
