<template>
  <view class="store-page">
    <view class="top-panel">
      <view class="switch-row">
        <view
          v-for="tab in tabs"
          :key="tab.key"
          class="switch-pill"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key as 'all' | 'common'"
        >
          {{ tab.label }}
        </view>
      </view>

      <view class="search-row">
        <view class="fake-search">搜索附近门店 / 施工点</view>
        <view class="map-button" @click="showMapTip">地图</view>
      </view>

      <view class="current-store-card" v-if="currentStore">
        <text class="current-store-label">当前已选门店</text>
        <text class="current-store-name">{{ currentStore.name }}</text>
        <text class="current-store-address">{{ currentStore.address }}</text>
      </view>
    </view>

    <view class="store-list">
      <view
        v-for="store in displayStores"
        :key="store.id"
        class="store-card"
        :class="{ selected: currentStore?.id === store.id }"
      >
        <view class="store-card-head">
          <view>
            <view class="store-name-row">
              <text class="store-name">{{ store.name }}</text>
              <text class="store-status">{{ store.status === 1 ? '营业中' : '休息中' }}</text>
            </view>
            <text class="store-hours">{{ store.businessHours || '09:00-20:00' }}</text>
          </view>
          <text v-if="currentStore?.id === store.id" class="selected-mark">已选</text>
        </view>

        <text class="store-address">{{ store.address }}</text>
        <text class="store-phone">{{ store.phone }}</text>

        <view class="store-actions">
          <view class="ghost-action" @click="selectStore(store)">
            {{ currentStore?.id === store.id ? '继续使用' : '选择门店' }}
          </view>
          <view class="ghost-action" @click="callStore(store.phone)">电话</view>
          <view class="ghost-action" @click="showMapTip">导航</view>
          <view class="primary-action" @click="enterStore(store)">进店选购</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getStores } from '@/services/modules/store'
import { useStoreStore } from '@/stores/store'
import { mockStores } from '@/utils/catalog'
import type { StoreItem } from '@/types/entities'

const tabs = [
  { key: 'all', label: '选择门店' },
  { key: 'common', label: '常用门店' },
] as const

const activeTab = ref<'all' | 'common'>('all')
const stores = ref<StoreItem[]>(mockStores)
const currentStore = ref<StoreItem | null>(null)

const displayStores = computed(() => {
  if (activeTab.value === 'common') {
    return stores.value.slice(0, 2)
  }
  return stores.value
})

async function loadStores() {
  try {
    const response = (await getStores()) as any
    if (Array.isArray(response) && response.length) {
      stores.value = response
      return
    }
  } catch {
    // Use local demo data when API is unavailable.
  }
  stores.value = mockStores
}

function syncCurrentStore() {
  const storeStore = useStoreStore()
  storeStore.restore()
  currentStore.value = storeStore.currentStore
}

function selectStore(store: StoreItem) {
  useStoreStore().selectStore(store)
  currentStore.value = store
  uni.showToast({ title: '已切换门店', icon: 'none' })
}

function enterStore(store: StoreItem) {
  selectStore(store)
  uni.navigateTo({
    url: `/pages/store/products?storeId=${store.id}&storeName=${encodeURIComponent(store.name)}`,
  })
}

function callStore(phone: string) {
  uni.makePhoneCall({ phoneNumber: phone })
}

function showMapTip() {
  uni.showToast({ title: '地图导航后续接入', icon: 'none' })
}

onLoad(() => {
  loadStores()
  syncCurrentStore()
})

onShow(() => {
  syncCurrentStore()
})
</script>

<style lang="scss" scoped>
.store-page {
  min-height: 100vh;
  background: #f3f2ee;
  padding: 16px;
}

.top-panel {
  padding: 16px;
  border-radius: 24px;
  background: #ffffff;
}

.switch-row {
  display: inline-flex;
  gap: 8px;
  padding: 4px;
  border-radius: 999px;
  background: #f1eee8;
}

.switch-pill {
  min-width: 92px;
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f6657;
  font-size: 12px;
}

.switch-pill.active {
  background: #171717;
  color: #ffffff;
}

.search-row {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.fake-search {
  flex: 1;
  height: 40px;
  border-radius: 999px;
  background: #f4f1eb;
  color: #9b9588;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.map-button {
  width: 64px;
  height: 40px;
  border-radius: 999px;
  background: #efe4d0;
  color: #8f6120;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.current-store-card {
  margin-top: 16px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f6ead5 0%, #fff9ef 100%);
}

.current-store-label {
  display: block;
  font-size: 11px;
  color: #9f6f2b;
}

.current-store-name {
  display: block;
  margin-top: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #171717;
}

.current-store-address {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #776f62;
}

.store-list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.store-card {
  padding: 18px 16px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid transparent;
}

.store-card.selected {
  border-color: #d4a15d;
  box-shadow: 0 12px 26px rgba(170, 119, 45, 0.1);
}

.store-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.store-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.store-name {
  font-size: 16px;
  font-weight: 700;
  color: #151515;
}

.store-status {
  padding: 4px 8px;
  border-radius: 999px;
  background: #edf6ed;
  color: #2d8d39;
  font-size: 10px;
}

.store-hours,
.store-address,
.store-phone {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #7e7669;
}

.selected-mark {
  min-width: 40px;
  height: 24px;
  border-radius: 999px;
  background: #171717;
  color: #ffffff;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.ghost-action,
.primary-action {
  height: 36px;
  border-radius: 999px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ghost-action {
  background: #f5f3ee;
  color: #4a453d;
}

.primary-action {
  background: linear-gradient(135deg, #161616 0%, #3b2a14 100%);
  color: #ffffff;
}
</style>
