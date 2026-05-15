<template>
  <view class="store-products-page">
    <!-- 门店简介 -->
    <view class="store-brief">
      <text class="store-brief-name">{{ storeName }}</text>
      <text class="store-brief-addr">{{ storeAddress }}</text>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'product' }"
        @click="switchTab('product')"
      >
        商品项目
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'package' }"
        @click="switchTab('package')"
      >
        精选套餐
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list" v-if="activeTab === 'product'">
      <view
        class="product-card"
        v-for="(product, idx) in products"
        :key="idx"
        @click="goDetail(product, 'product')"
      >
        <view class="product-img">
          <image v-if="product.mainImages" :src="product.mainImages[0]" mode="aspectFill" />
          <text v-else class="img-placeholder">🚗</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-brief">{{ product.brief || product.priceDescription }}</text>
          <text class="product-cat">{{ categoryText(product.category) }}</text>
        </view>
        <text class="product-arrow">›</text>
      </view>

      <view v-if="products.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无商品</text>
      </view>
    </view>

    <!-- 套餐列表 -->
    <view class="package-list" v-if="activeTab === 'package'">
      <view
        class="package-card"
        v-for="(pkg, idx) in packages"
        :key="idx"
        @click="goDetail(pkg, 'package')"
      >
        <view class="package-header">
          <text class="package-name">{{ pkg.name }}</text>
          <text class="package-price" v-if="pkg.price">¥{{ pkg.price }}</text>
        </view>
        <text class="package-desc">{{ pkg.description || '精选改装套餐，品质服务保障' }}</text>
        <view class="package-tags" v-if="pkg.products?.length">
          <text class="tag" v-for="(item, i) in pkg.products" :key="i">{{ item.name || item }}</text>
        </view>
      </view>

      <view v-if="packages.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无套餐</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      storeId: '',
      storeName: '',
      storeAddress: '',
      activeTab: 'product',
      products: [],
      packages: [],
      loading: false,
    };
  },

  onLoad(options) {
    this.storeId = options.storeId || '';
    this.storeName = decodeURIComponent(options.storeName || '门店商品');
    this.storeAddress = uni.getStorageSync('currentStoreAddress') || '';
    this.loadProducts();
    this.loadPackages();
  },

  methods: {
    categoryText(cat) {
      const map = { exterior: '外观改装', interior: '内饰改装', function: '功能升级', comfort: '舒适配置' };
      return map[cat] || cat || '其他';
    },

    switchTab(tab) {
      this.activeTab = tab;
    },

    async loadProducts() {
      this.loading = true;
      try {
        if (this.storeId) {
          const res = await this.$api.getStoreProducts(this.storeId);
          this.products = res.data || res.list || res || [];
        }
      } catch (e) {
        // 模拟数据
        this.products = [
          { id: 'p1', name: '隐形车衣（TPU）', brief: '原厂漆面保护', category: 'exterior' },
          { id: 'p2', name: '改色膜', brief: '百种颜色可选', category: 'exterior' },
          { id: 'p4', name: '真皮座椅包覆', brief: 'Nappa真皮', category: 'interior' },
          { id: 'p6', name: '64色氛围灯', brief: '智能律动', category: 'function' },
        ];
      } finally {
        this.loading = false;
      }
    },

    async loadPackages() {
      try {
        const res = await this.$api.getPackages();
        this.packages = res.data || res.list || res || [];
      } catch (e) {
        this.packages = [
          { id: 'pk1', name: '全车漆面保护套餐', price: '12800', description: 'TPU隐形车衣+天窗冰甲', products: ['隐形车衣', '天窗冰甲'] },
          { id: 'pk2', name: '内饰升级套餐', price: '8800', description: '真皮座椅+航空脚垫+氛围灯', products: ['真皮座椅', '航空脚垫', '氛围灯'] },
        ];
      }
    },

    goDetail(item, type) {
      uni.navigateTo({
        url: `/pages/product-detail/product-detail?id=${item.id}&type=${type}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.store-products-page {
  padding: 0 0 20px;
}

.store-brief {
  padding: 16px;
  background: linear-gradient(135deg, #1a2a4a, #2d4a7a);
  color: #fff;
}

.store-brief-name {
  font-size: 18px;
  font-weight: 700;
  display: block;
}

.store-brief-addr {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 6px;
  display: block;
}

.tab-bar {
  display: flex;
  background: #FFFFFF;
  padding: 0 16px;
  border-bottom: 1px solid #E5E5EA;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 15px;
  color: #8E8E93;
  position: relative;
}

.tab-item.active {
  color: #D8A04A;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background: #D8A04A;
  border-radius: 3px 3px 0 0;
}

.product-list,
.package-list {
  padding: 12px 16px;
}

.product-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.product-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f0f5, #e8e8ed);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-img image { width: 100%; height: 100%; border-radius: 8px; }
.img-placeholder { font-size: 24px; }

.product-info { flex: 1; }

.product-name {
  font-size: 14px;
  font-weight: 600;
  display: block;
}

.product-brief {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 3px;
  display: block;
}

.product-cat {
  font-size: 11px;
  color: #D8A04A;
  background: #FEF6EC;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
  display: inline-block;
}

.product-arrow { font-size: 18px; color: #C7C7CC; }

.package-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #F0E6DB;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.package-name { font-size: 15px; font-weight: 700; }

.package-price {
  font-size: 16px;
  font-weight: 700;
  color: #C97A18;
}

.package-desc {
  font-size: 13px;
  color: #8E8E93;
  display: block;
  margin-bottom: 10px;
}

.package-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  color: #6b7280;
  background: #F3F4F6;
  padding: 2px 10px;
  border-radius: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon { font-size: 48px; display: block; margin-bottom: 8px; }
.empty-text { font-size: 14px; color: #8E8E93; }
</style>
