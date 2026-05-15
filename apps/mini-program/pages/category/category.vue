<template>
  <view class="category-page">
    <!-- 分类导航 -->
    <view class="category-nav">
      <scroll-view class="nav-list" scroll-y :style="{ height: scrollHeight + 'px' }">
        <view
          v-for="(cat, idx) in categories"
          :key="idx"
          class="nav-item"
          :class="{ active: activeCategory === cat.key }"
          @click="switchCategory(cat.key)"
        >
          <text class="nav-icon">{{ cat.icon }}</text>
          <text class="nav-text">{{ cat.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 商品列表 -->
    <view class="category-content" :style="{ height: scrollHeight + 'px' }">
      <scroll-view scroll-y @scrolltolower="loadMore">
        <view v-if="currentCategory" class="category-header">
          <text class="category-title">{{ currentCategory.name }}</text>
          <text class="category-desc">{{ currentCategory.desc }}</text>
        </view>

        <view class="product-grid">
          <view
            class="product-item"
            v-for="(product, idx) in productList"
            :key="idx"
            @click="goDetail(product)"
          >
            <view class="product-img">
              <image v-if="product.mainImages" :src="product.mainImages[0]" mode="aspectFill" />
              <text v-else class="img-placeholder">🚗</text>
            </view>
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-brief">{{ product.brief || product.priceDescription }}</text>
            </view>
          </view>
        </view>

        <view v-if="loading" class="loading-more">加载中...</view>
        <view v-if="!hasMore && productList.length > 0" class="no-more">— 已加载全部 —</view>
        <view v-if="!loading && productList.length === 0" class="empty-state">
          <text class="empty-icon">📦</text>
          <text class="empty-text">暂无商品</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollHeight: 600,
      activeCategory: 'all',
      categories: [
        { key: 'all', name: '全部', icon: '📋', desc: '浏览所有改装项目' },
        { key: 'exterior', name: '外观改装', icon: '🚗', desc: '车衣、改色、包围等' },
        { key: 'interior', name: '内饰改装', icon: '💺', desc: '座椅、方向盘、脚垫等' },
        { key: 'function', name: '功能升级', icon: '🔧', desc: '音响、氛围灯、电尾门等' },
        { key: 'comfort', name: '舒适配置', icon: '✨', desc: '座椅通风、加热等' },
      ],
      productList: [],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
    };
  },

  computed: {
    currentCategory() {
      return this.categories.find(c => c.key === this.activeCategory);
    },
  },

  onLoad() {
    const sysInfo = uni.getSystemInfoSync();
    this.scrollHeight = sysInfo.windowHeight - 50;
    this.loadProducts(true);
  },

  methods: {
    switchCategory(key) {
      if (this.activeCategory === key) return;
      this.activeCategory = key;
      this.productList = [];
      this.page = 1;
      this.hasMore = true;
      this.loadProducts(true);
    },

    async loadProducts(refresh = false) {
      if (this.loading) return;
      this.loading = true;

      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          ...(this.activeCategory !== 'all' ? { category: this.activeCategory } : {}),
        };
        const res = await this.$api.getProducts(params);
        if (refresh) {
          this.productList = res.data || res.list || res || [];
        } else {
          const list = res.data || res.list || res || [];
          this.productList = this.productList.concat(list);
        }
        this.hasMore = (res.data || res.list || res || []).length >= this.pageSize;
      } catch (e) {
        // 模拟数据
        this.productList = this.getMockProducts();
      } finally {
        this.loading = false;
      }
    },

    loadMore() {
      if (!this.hasMore || this.loading) return;
      this.page++;
      this.loadProducts();
    },

    goDetail(product) {
      uni.navigateTo({
        url: `/pages/product-detail/product-detail?id=${product.id}&type=product`,
      });
    },

    getMockProducts() {
      const categories = {
        exterior: [
          { id: 'p1', name: '隐形车衣（TPU）', mainImages: [], brief: '原厂漆面保护 · 耐刮擦', category: 'exterior' },
          { id: 'p2', name: '改色膜', mainImages: [], brief: '百种颜色可选 · 个性定制', category: 'exterior' },
          { id: 'p3', name: '外观包围套件', mainImages: [], brief: '运动风格 · 碳纤维材质', category: 'exterior' },
        ],
        interior: [
          { id: 'p4', name: '真皮座椅包覆', mainImages: [], brief: 'Nappa真皮 · 原厂工艺', category: 'interior' },
          { id: 'p5', name: '航空软包脚垫', mainImages: [], brief: '全车定制 · 易清洁', category: 'interior' },
        ],
        function: [
          { id: 'p6', name: '64色氛围灯', mainImages: [], brief: '智能律动 · APP控制', category: 'function' },
          { id: 'p7', name: '音响升级套装', mainImages: [], brief: '品牌音响 · 专业调音', category: 'function' },
        ],
        comfort: [
          { id: 'p8', name: '座椅通风系统', mainImages: [], brief: '夏季清凉 · 静音风机', category: 'comfort' },
        ],
      };
      if (this.activeCategory === 'all') {
        return Object.values(categories).flat();
      }
      return categories[this.activeCategory] || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.category-page {
  display: flex;
  background: #F2F2F7;
}

.category-nav {
  width: 90px;
  background: #FFFFFF;
  flex-shrink: 0;
}

.nav-list {
  padding: 8px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  font-size: 12px;
  color: #8E8E93;
  position: relative;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.nav-item.active {
  color: #D8A04A;
  background: #FEFCF7;
  border-left-color: #D8A04A;
  font-weight: 600;
}

.nav-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
  line-height: 1.4;
}

.category-content {
  flex: 1;
  padding: 0 12px;
}

.category-header {
  padding: 16px 0 12px;
}

.category-title {
  font-size: 17px;
  font-weight: 700;
  color: #111;
}

.category-desc {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 4px;
  display: block;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.product-item {
  width: calc(50% - 5px);
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.product-img {
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #f0f0f5, #e8e8ed);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img image {
  width: 100%;
  height: 100%;
}

.img-placeholder {
  font-size: 32px;
}

.product-info {
  padding: 8px 10px 10px;
}

.product-name {
  font-size: 13px;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-brief {
  font-size: 11px;
  color: #8E8E93;
  display: block;
}

.loading-more,
.no-more,
.empty-state {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: #8E8E93;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 60px;
}

.empty-icon {
  font-size: 48px;
}

.empty-text {
  font-size: 14px;
  color: #8E8E93;
}
</style>
