<template>
  <view class="mine-page">
    <view class="hero">
      <view class="user-row" @click="handleLogin()">
        <view class="avatar">{{ avatarText }}</view>
        <view class="user-copy">
          <text class="user-name">{{ userName }}</text>
          <text class="user-phone">{{ userPhone }}</text>
        </view>
        <text class="user-tag">{{ userInfo ? '会员' : '登录' }}</text>
      </view>

      <view class="member-card">
        <text class="member-title">蓝辉门店顾问服务</text>
        <text class="member-subtitle">预约单、门店、顾问跟进统一同步</text>
      </view>
    </view>

    <view class="stats-card">
      <view v-for="stat in stats" :key="stat.key" class="stat-item" @click="goHistory()">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>

    <view class="service-card">
      <view class="card-head">
        <text class="card-title">我的服务</text>
      </view>
      <view class="service-grid">
        <view v-for="entry in serviceEntries" :key="entry.key" class="service-item" @click="handleEntry(entry.key)">
          <view class="service-icon">{{ entry.icon }}</view>
          <text class="service-label">{{ entry.label }}</text>
        </view>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @click="goHistory()">
        <text class="menu-label">我的预约</text>
        <text class="menu-value">查看状态与详情</text>
      </view>
      <view class="menu-item" @click="goStore()">
        <text class="menu-label">门店导航</text>
        <text class="menu-value">切换到店门店</text>
      </view>
      <view class="menu-item" @click="showAbout()">
        <text class="menu-label">品牌介绍</text>
        <text class="menu-value">了解蓝辉轻改</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getMyReservations } from '@/services/modules/reservation'
import { useUserStore } from '@/stores/user'
import { mineServiceEntries } from '@/utils/catalog'
import type { UserProfile } from '@/types/entities'

const userInfo = ref<UserProfile | null>(null)
const stats = reactive([
  { key: 'pending', label: '待处理', value: 0 },
  { key: 'confirmed', label: '已确认', value: 0 },
  { key: 'completed', label: '已完成', value: 0 },
])
const serviceEntries = mineServiceEntries

const userName = computed(() => userInfo.value?.nickname || '微信用户')
const userPhone = computed(() => userInfo.value?.phone || '点击登录后同步预约信息')
const avatarText = computed(() => (userInfo.value?.nickname?.slice(0, 1) || '辉'))

function syncUser() {
  const store = useUserStore()
  store.restore()
  userInfo.value = store.userInfo
}

async function loadStats() {
  try {
    await useUserStore().ensureSession()
    const response = await getMyReservations()
    const list = Array.isArray(response) ? response : []
    stats[0].value = list.filter((item) => item.status === 'pending' || item.status === 'contacted').length
    stats[1].value = list.filter((item) => item.status === 'confirmed').length
    stats[2].value = list.filter((item) => item.status === 'completed').length
  } catch {
    stats[0].value = 2
    stats[1].value = 1
    stats[2].value = 5
  }
}

async function handleLogin() {
  if (userInfo.value) return
  const store = useUserStore()
  await store.ensureSession()
  const profile = {
    nickname: '蓝辉车主',
    phone: '138****8888',
    avatarUrl: '',
  }
  store.setUserInfo(profile)
  userInfo.value = profile
  uni.showToast({ title: '登录成功', icon: 'none' })
}

function handleEntry(key: string) {
  if (key === 'reservations') return goHistory()
  if (key === 'stores') return goStore()
  if (key === 'contact') return uni.makePhoneCall({ phoneNumber: '020-12345678' })
  if (key === 'feedback') {
    uni.showToast({ title: '反馈入口后续接入', icon: 'none' })
    return
  }
  showAbout()
}

function goHistory() {
  uni.navigateTo({ url: '/pages/booking/history' })
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

function showAbout() {
  uni.showModal({
    title: '蓝辉轻改',
    content: '围绕新能源车型轻改、门店施工与预约到店服务打造统一体验。',
    showCancel: false,
  })
}

onLoad(() => {
  syncUser()
  loadStats()
})

onShow(() => {
  syncUser()
  loadStats()
})
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f3f2ee;
  padding-bottom: 24px;
}

.hero {
  padding: 18px 16px 72px;
  background: linear-gradient(180deg, #dfbf85 0%, #c79b58 100%);
}

.user-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-copy {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.user-phone {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.84);
}

.user-tag {
  min-width: 48px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-card,
.stats-card,
.service-card,
.menu-card {
  margin: -40px 16px 0;
  border-radius: 24px;
  background: #ffffff;
}

.member-card {
  position: relative;
  margin-top: 18px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #3f3422 0%, #7a6035 100%);
}

.member-title {
  display: block;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
}

.member-subtitle {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.74);
}

.stats-card {
  margin-top: 14px;
  padding: 18px 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #b67c2d;
}

.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #736c62;
}

.service-card,
.menu-card {
  margin-top: 14px;
  padding: 18px 16px;
}

.card-head {
  margin-bottom: 14px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #171717;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 10px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.service-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: #f5efe4;
  color: #8f6120;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-label {
  font-size: 12px;
  color: #272727;
}

.menu-card {
  display: grid;
  gap: 12px;
}

.menu-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f1ede6;
}

.menu-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.menu-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #171717;
}

.menu-value {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #7b7469;
}
</style>
