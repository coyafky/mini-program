<template>
  <view class="history-page">
    <view class="status-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="status-tab"
        :class="{ active: activeStatus === tab.value }"
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>

    <view class="history-list">
      <view
        v-for="booking in filteredList"
        :key="booking.id"
        class="history-card"
        @click="goDetail(booking.id)"
      >
        <view class="history-head">
          <text class="history-no">{{ booking.orderNo }}</text>
          <text class="history-status" :class="booking.status">{{ statusText(booking.status) }}</text>
        </view>
        <text class="history-store">{{ booking.store?.name || booking.storeName || '蓝辉轻改门店' }}</text>
        <text class="history-product">
          {{ booking.productName || booking.packageName || booking.product?.name || '到店咨询' }}
        </text>
        <view class="history-foot">
          <text class="history-time">{{ formatDate(booking.appointmentDate) }}</text>
          <text class="history-link">查看详情</text>
        </view>
      </view>

      <view v-if="!loading && !filteredList.length" class="empty-state">
        <text class="empty-title">还没有预约记录</text>
        <text class="empty-subtitle">提交预约后，会在这里查看预约状态和历史详情</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getMyReservations } from '@/services/modules/reservation'
import { useUserStore } from '@/stores/user'
import { formatDate, statusText } from '@/utils/format'
import type { ReservationItem } from '@/types/entities'

const loading = ref(false)
const activeStatus = ref('all')
const list = ref<ReservationItem[]>([])

const statusTabs = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'contacted', label: '已联系' },
  { value: 'confirmed', label: '已确认' },
  { value: 'completed', label: '已完成' },
]

const filteredList = computed(() => {
  if (activeStatus.value === 'all') return list.value
  return list.value.filter((item) => item.status === activeStatus.value)
})

async function loadHistory() {
  loading.value = true
  try {
    await useUserStore().ensureSession()
    const response = await getMyReservations()
    list.value = Array.isArray(response) ? response : []
  } catch {
    list.value = [
      {
        id: 'reservation-1',
        orderNo: 'LH20260514001',
        status: 'pending',
        storeName: '蓝辉轻改广州旗舰店',
        productName: 'XPEL TPU 隐形车衣',
        appointmentDate: '2026-05-18',
      },
      {
        id: 'reservation-2',
        orderNo: 'LH20260510002',
        status: 'confirmed',
        storeName: '蓝辉轻改海珠精选店',
        packageName: '座舱舒享升级套餐',
        appointmentDate: '2026-05-21',
      },
    ]
  } finally {
    loading.value = false
  }
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/booking/detail?id=${id}` })
}

onLoad(() => {
  loadHistory()
})

onShow(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: #f3f2ee;
}

.status-tabs {
  padding: 12px 16px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.status-tab {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ebe7df;
  color: #696155;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.status-tab.active {
  background: #171717;
  color: #ffffff;
}

.history-list {
  padding: 12px 16px 24px;
  display: grid;
  gap: 12px;
}

.history-card {
  padding: 18px 16px;
  border-radius: 24px;
  background: #ffffff;
}

.history-head,
.history-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-no {
  font-size: 12px;
  color: #8d867b;
}

.history-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
}

.history-status.pending {
  background: #fff4d8;
  color: #b0791f;
}

.history-status.contacted {
  background: #e9f2ff;
  color: #2f68b7;
}

.history-status.confirmed {
  background: #edf6ed;
  color: #2b8a37;
}

.history-status.completed {
  background: #efefef;
  color: #616161;
}

.history-store {
  display: block;
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #171717;
}

.history-product {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #6f685d;
}

.history-foot {
  margin-top: 14px;
}

.history-time,
.history-link {
  font-size: 12px;
}

.history-time {
  color: #8c8579;
}

.history-link {
  color: #a16d25;
}

.empty-state {
  padding: 64px 20px;
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 15px;
  color: #171717;
}

.empty-subtitle {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #847d72;
}
</style>
