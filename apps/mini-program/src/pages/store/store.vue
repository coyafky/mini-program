<template>
  <view class="store-page">
    <!-- 当前门店信息 -->
    <view class="current-store" v-if="currentStore" @click="showStoreDetail(currentStore)">
      <view class="store-header">
        <text class="store-icon">🏪</text>
        <view class="store-info">
          <text class="store-name">{{ currentStore.name }}</text>
          <text class="store-address">{{ currentStore.address }}</text>
        </view>
        <text class="store-arrow">›</text>
      </view>
      <view class="store-meta">
        <text class="meta-item">📞 {{ currentStore.phone }}</text>
        <text class="meta-item">🕐 {{ currentStore.businessHours || '09:00-18:00' }}</text>
      </view>
    </view>

    <!-- 门店列表 -->
    <view class="section-header">
      <text class="section-title">全部门店</text>
      <text class="section-count">{{ stores.length }}家门店</text>
    </view>

    <view class="store-list">
      <view
        class="store-card"
        v-for="(store, idx) in stores"
        :key="store.id || idx"
        @click="selectStore(store)"
      >
        <view class="store-card-header">
          <view class="store-card-info">
            <text class="store-card-name">{{ store.name }}</text>
            <text class="store-card-status">
              <text class="status-dot" :class="{ active: store.status === 1 }"></text>
              {{ store.status === 1 ? '营业中' : '休息中' }}
            </text>
          </view>
          <button
            class="select-btn"
            :class="{ selected: currentStore?.id === store.id }"
            size="mini"
            @click.stop="selectStore(store)"
          >
            {{ currentStore?.id === store.id ? '已选择' : '选择' }}
          </button>
        </view>
        <view class="store-card-body">
          <text class="store-addr">📍 {{ store.address }}</text>
          <text class="store-phone">📞 {{ store.phone }}</text>
          <text class="store-hours">🕐 {{ store.businessHours || '09:00-18:00' }}</text>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-if="!loading && stores.length === 0" class="empty-state">
      <text class="empty-icon">🏪</text>
      <text class="empty-text">暂无门店信息</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stores: [],
      currentStore: null,
      loading: false,
    };
  },

  onLoad() {
    this.loadStores();
    this.loadCurrentStore();
  },

  onShow() {
    this.loadCurrentStore();
  },

  methods: {
    async loadStores() {
      this.loading = true;
      try {
        const res = await this.$api.getStores();
        this.stores = res.data || res.list || res || [];
      } catch (e) {
        // 模拟数据
        this.stores = [
          { id: 's1', name: '蓝辉轻改·旗舰店', address: '广州市天河区天河路228号', phone: '020-12345678', businessHours: '09:00-20:00', status: 1 },
          { id: 's2', name: '蓝辉轻改·海珠店', address: '广州市海珠区新港中路100号', phone: '020-87654321', businessHours: '09:00-18:00', status: 1 },
          { id: 's3', name: '蓝辉轻改·番禺店', address: '广州市番禺区南村镇万博中心', phone: '020-11223344', businessHours: '10:00-19:00', status: 1 },
        ];
      } finally {
        this.loading = false;
      }
    },

    loadCurrentStore() {
      const id = uni.getStorageSync('currentStoreId');
      const name = uni.getStorageSync('currentStoreName');
      if (id && name) {
        this.currentStore = { id, name, address: uni.getStorageSync('currentStoreAddress') || '' };
      }
    },

    selectStore(store) {
      uni.setStorageSync('currentStoreId', store.id);
      uni.setStorageSync('currentStoreName', store.name);
      uni.setStorageSync('currentStoreAddress', store.address);
      this.currentStore = store;
      uni.showToast({ title: '已选择门店', icon: 'success' });
    },

    showStoreDetail(store) {
      uni.navigateTo({
        url: `/pages/store-products/store-products?storeId=${store.id}&storeName=${encodeURIComponent(store.name)}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.store-page {
  padding: 12px 16px;
}

.current-store {
  background: linear-gradient(135deg, #1a2a4a, #2d4a7a);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 16px;
  color: #fff;
}

.store-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.store-icon { font-size: 28px; }

.store-info { flex: 1; }

.store-name {
  font-size: 17px;
  font-weight: 700;
  display: block;
}

.store-address {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: block;
}

.store-arrow { font-size: 22px; opacity: 0.7; }

.store-meta {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.15);
}

.meta-item { font-size: 12px; opacity: 0.85; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title { font-size: 17px; font-weight: 600; }

.section-count { font-size: 12px; color: #8E8E93; }

.store-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.store-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.store-card-info { flex: 1; }

.store-card-name {
  font-size: 15px;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.store-card-status {
  font-size: 12px;
  color: #8E8E93;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E5E5EA;
  margin-right: 4px;
  vertical-align: middle;
}

.status-dot.active {
  background: #17A34A;
}

.select-btn {
  background: #D8A04A;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  padding: 4px 16px;
}

.select-btn.selected {
  background: #E5E5EA;
  color: #8E8E93;
}

.store-card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.store-addr,
.store-phone,
.store-hours {
  font-size: 12px;
  color: #8E8E93;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon { font-size: 48px; display: block; margin-bottom: 8px; }
.empty-text { font-size: 14px; color: #8E8E93; }
</style>
