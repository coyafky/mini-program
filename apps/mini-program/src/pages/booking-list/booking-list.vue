<template>
  <view class="booking-list-page">
    <!-- 状态切换 -->
    <view class="status-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="status-tab"
        :class="{ active: activeStatus === tab.value }"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 列表 -->
    <view class="list-content">
      <view
        class="booking-card"
        v-for="(booking, idx) in filteredList"
        :key="booking.id || idx"
        @click="goDetail(booking)"
      >
        <view class="card-header">
          <text class="card-no">{{ booking.orderNo }}</text>
          <text class="card-status" :class="booking.status">{{ statusText(booking.status) }}</text>
        </view>
        <view class="card-body">
          <view class="card-row">
            <text class="card-label">预约门店</text>
            <text class="card-value">{{ booking.store?.name || booking.storeName || '蓝辉轻改' }}</text>
          </view>
          <view class="card-row">
            <text class="card-label">预约项目</text>
            <text class="card-value">{{ booking.product?.name || booking.productName || booking.remark || '到店咨询' }}</text>
          </view>
          <view class="card-row">
            <text class="card-label">预约时间</text>
            <text class="card-value">{{ formatDate(booking.appointmentDate) }}</text>
          </view>
        </view>
        <view class="card-footer" @click.stop="goDetail(booking)">
          <text class="footer-text">查看详情</text>
          <text class="footer-arrow">›</text>
        </view>
      </view>

      <view v-if="loading" class="loading-state">加载中...</view>
      <view v-if="!loading && filteredList.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无预约记录</text>
        <button class="book-btn" @click="goBooking">立即预约</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeStatus: 'all',
      statusTabs: [
        { value: 'all', label: '全部' },
        { value: 'pending', label: '待处理' },
        { value: 'contacted', label: '已联系' },
        { value: 'confirmed', label: '已确认' },
        { value: 'completed', label: '已完成' },
      ],
      list: [],
      loading: false,
    };
  },

  computed: {
    filteredList() {
      if (this.activeStatus === 'all') return this.list;
      return this.list.filter((item) => item.status === this.activeStatus);
    },
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  methods: {
    statusText(status) {
      const map = {
        pending: '待处理',
        contacted: '已联系',
        confirmed: '已确认',
        completed: '已完成',
        closed: '已关闭',
      };
      return map[status] || status || '待处理';
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    },

    switchStatus(status) {
      this.activeStatus = status;
    },

    async loadList() {
      this.loading = true;
      try {
        const res = await this.$api.getMyReservations();
        this.list = res.data || res.list || res || [];
      } catch (e) {
        // 模拟数据
        this.list = [
          { id: 'r1', orderNo: 'LH20250101001', status: 'pending', storeName: '蓝辉轻改·旗舰店', productName: '隐形车衣', appointmentDate: '2025-01-15', remark: '到店咨询' },
          { id: 'r2', orderNo: 'LH20250102002', status: 'contacted', storeName: '蓝辉轻改·海珠店', productName: '改色膜', appointmentDate: '2025-01-18', remark: '哑光灰色' },
          { id: 'r3', orderNo: 'LH20250103003', status: 'confirmed', storeName: '蓝辉轻改·旗舰店', productName: '内饰升级套餐', appointmentDate: '2025-01-20' },
          { id: 'r4', orderNo: 'LH20241220004', status: 'completed', storeName: '蓝辉轻改·番禺店', productName: '64色氛围灯', appointmentDate: '2024-12-25' },
        ];
      } finally {
        this.loading = false;
      }
    },

    goDetail(booking) {
      uni.navigateTo({
        url: `/pages/booking-detail/booking-detail?id=${booking.id}`,
      });
    },

    goBooking() {
      uni.navigateTo({ url: '/pages/booking-submit/booking-submit' });
    },
  },
};
</script>

<style lang="scss" scoped>
.booking-list-page {
  min-height: 100vh;
}

.status-tabs {
  display: flex;
  background: #FFFFFF;
  padding: 8px 16px;
  gap: 6px;
  border-bottom: 1px solid #F2F2F7;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow-x: auto;
  white-space: nowrap;
}

.status-tab {
  padding: 6px 16px;
  font-size: 13px;
  color: #8E8E93;
  border-radius: 16px;
  background: #F2F2F7;
  flex-shrink: 0;
  transition: all 0.2s;
}

.status-tab.active {
  color: #fff;
  background: #D8A04A;
  font-weight: 600;
}

.list-content {
  padding: 12px 16px;
}

.booking-card {
  background: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 8px;
}

.card-no {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 500;
}

.card-status {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.card-status.pending {
  color: #EAB308;
  background: #FEFCE8;
}

.card-status.contacted {
  color: #3B82F6;
  background: #EFF6FF;
}

.card-status.confirmed {
  color: #17A34A;
  background: #F0FDF4;
}

.card-status.completed {
  color: #8E8E93;
  background: #F2F2F7;
}

.card-body {
  padding: 4px 16px 8px;
}

.card-row {
  display: flex;
  padding: 4px 0;
}

.card-label {
  font-size: 13px;
  color: #8E8E93;
  width: 70px;
  flex-shrink: 0;
}

.card-value {
  font-size: 13px;
  color: #111;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid #F2F2F7;
}

.footer-text {
  font-size: 13px;
  color: #D8A04A;
}

.footer-arrow {
  font-size: 16px;
  color: #D8A04A;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 56px;
  display: block;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #8E8E93;
  display: block;
  margin-bottom: 16px;
}

.book-btn {
  width: 160px;
  height: 40px;
  background: linear-gradient(135deg, #D8A04A, #C97A18);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin: 0 auto;
}
</style>
