<template>
  <view class="success-page">
    <view class="success-card">
      <view class="success-mark">成</view>
      <text class="success-title">预约提交成功</text>
      <text class="success-subtitle">顾问会根据你提交的预约单尽快联系确认</text>

      <view class="order-box">
        <view class="order-row">
          <text class="order-label">预约单号</text>
          <text class="order-value">{{ orderNo }}</text>
        </view>
        <view class="order-row">
          <text class="order-label">提交时间</text>
          <text class="order-value">{{ submitTime }}</text>
        </view>
      </view>
    </view>

    <view class="tip-card">
      <text class="tip-title">到店提醒</text>
      <text class="tip-line">1. 顾问会先电话确认时间和车型信息</text>
      <text class="tip-line">2. 多项目需求会以备注中的预约单明细为准</text>
      <text class="tip-line">3. 到店后可继续调整施工方案和套餐内容</text>
    </view>

    <view class="action-group">
      <button class="primary-btn" @click="goHistory()">查看我的预约</button>
      <button class="secondary-btn" @click="goHome()">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const orderNo = ref('')
const submitTime = ref('')

function formatNow() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function goHistory() {
  uni.redirectTo({ url: '/pages/booking/history' })
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}

onLoad((options) => {
  orderNo.value = options?.orderNo || `LH${Date.now()}`
  submitTime.value = formatNow()
})
</script>

<style lang="scss" scoped>
.success-page {
  min-height: 100vh;
  background: #f3f2ee;
  padding: 28px 16px;
}

.success-card,
.tip-card {
  padding: 26px 20px;
  border-radius: 28px;
  background: #ffffff;
}

.success-card {
  text-align: center;
}

.success-mark {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1dfbf 0%, #f7f0e2 100%);
  color: #8f5e16;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-title {
  display: block;
  margin-top: 18px;
  font-size: 22px;
  font-weight: 700;
  color: #171717;
}

.success-subtitle {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: #80796d;
}

.order-box {
  margin-top: 22px;
  padding: 16px;
  border-radius: 20px;
  background: #f8f6f1;
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.order-label,
.order-value {
  font-size: 12px;
  color: #4b463e;
}

.tip-card {
  margin-top: 14px;
}

.tip-title {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #171717;
}

.tip-line {
  display: block;
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: #7d776b;
}

.action-group {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  height: 48px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(135deg, #171717 0%, #46311a 100%);
  color: #ffffff;
}

.secondary-btn {
  background: #ffffff;
  color: #8d6321;
}
</style>
