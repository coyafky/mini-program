<template>
  <view class="detail-page">
    <!-- 商品图片 -->
    <view class="product-gallery">
      <swiper
        :indicator-dots="images.length > 1"
        indicator-color="rgba(255,255,255,0.4)"
        indicator-active-color="#D8A04A"
        :autoplay="false"
      >
        <swiper-item v-for="(img, idx) in images" :key="idx">
          <view class="gallery-item" :style="{ background: 'linear-gradient(135deg, #f0f0f5, #e8e8ed)' }">
            <text class="gallery-icon">{{ isPackage ? '📦' : '🚗' }}</text>
          </view>
        </swiper-item>
      </swiper>
      <view v-if="!images.length" class="gallery-placeholder">
        <text class="gallery-icon">{{ isPackage ? '📦' : '🚗' }}</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info-section">
      <view class="info-header">
        <text class="product-name">{{ item.name || '商品详情' }}</text>
        <text class="product-price" v-if="item.price">
          ¥{{ item.price }}
        </text>
      </view>
      <text class="product-brief" v-if="item.brief || item.priceDescription">
        {{ item.brief || item.priceDescription }}
      </text>
      <view class="product-meta" v-if="item.category">
        <text class="meta-tag">{{ categoryText(item.category) }}</text>
      </view>
    </view>

    <!-- 描述信息 -->
    <view class="desc-section" v-if="item.description">
      <view class="section-title-row">
        <text class="section-icon">📝</text>
        <text class="section-title-text">项目说明</text>
      </view>
      <text class="desc-content">{{ item.description }}</text>
    </view>

    <!-- 规格参数 -->
    <view class="spec-section" v-if="specs.length">
      <view class="section-title-row">
        <text class="section-icon">📋</text>
        <text class="section-title-text">规格参数</text>
      </view>
      <view class="spec-list">
        <view class="spec-item" v-for="(spec, idx) in specs" :key="idx">
          <text class="spec-label">{{ spec.label }}</text>
          <text class="spec-value">{{ spec.value }}</text>
        </view>
      </view>
    </view>

    <!-- 套餐包含项目 -->
    <view class="package-items-section" v-if="isPackage && packageItems.length">
      <view class="section-title-row">
        <text class="section-icon">🎯</text>
        <text class="section-title-text">套餐包含</text>
      </view>
      <view class="package-item" v-for="(item, idx) in packageItems" :key="idx">
        <text class="item-dot">•</text>
        <text class="item-name">{{ item.name || item }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left" @click="goStore">
        <text class="bar-icon">🏪</text>
        <text class="bar-text">门店</text>
      </view>
      <view class="bar-left" @click="goReservation">
        <text class="bar-icon">📋</text>
        <text class="bar-text">预约</text>
      </view>
      <button class="book-btn" @click="goBooking">立即预约</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      type: 'product',
      isPackage: false,
      item: {},
      images: [],
      specs: [],
      packageItems: [],
    };
  },

  onLoad(options) {
    this.id = options.id || '';
    this.type = options.type || 'product';
    this.isPackage = this.type === 'package';
    this.loadDetail();
  },

  methods: {
    categoryText(cat) {
      const map = { exterior: '外观改装', interior: '内饰改装', function: '功能升级', comfort: '舒适配置' };
      return map[cat] || cat || '其他';
    },

    async loadDetail() {
      try {
        const apiMethod = this.isPackage ? this.$api.getPackageDetail : this.$api.getProductDetail;
        const res = await apiMethod(this.id);
        this.item = res.data || res;
        if (this.item.mainImages) {
          try {
            this.images = typeof this.item.mainImages === 'string'
              ? JSON.parse(this.item.mainImages)
              : this.item.mainImages;
          } catch { this.images = []; }
        }
        if (this.item.specifications) {
          try {
            const parsed = typeof this.item.specifications === 'string'
              ? JSON.parse(this.item.specifications)
              : this.item.specifications;
            this.specs = Array.isArray(parsed) ? parsed : [];
          } catch { this.specs = []; }
        }
        if (this.item.packageProducts) {
          this.packageItems = this.item.packageProducts;
        }
      } catch (e) {
        // 模拟数据
        if (this.isPackage) {
          this.item = { id: this.id, name: '全车漆面保护套餐', price: '12800', brief: 'TPU隐形车衣+天窗冰甲', description: '采用进口TPU基材，自动修复划痕，质保10年。包含全车隐形车衣施工、天窗冰甲贴膜、车窗镀铬饰条黑化。', category: 'exterior' };
          this.packageItems = ['TPU隐形车衣（全车）', '天窗冰甲', '镀铬饰条黑化', '施工质保卡'];
          this.specs = [{ label: '质保年限', value: '10年' }, { label: '施工周期', value: '2-3天' }];
        } else {
          this.item = { id: this.id, name: '隐形车衣（TPU）', brief: '原厂漆面保护·自动修复', description: '采用美国进口TPU基材，具有优异的抗刮擦、抗腐蚀性能。表面涂层具备自动修复功能，细小划痕在阳光下即可自动修复。', category: 'exterior' };
          this.specs = [
            { label: '厚度', value: '8.5mil' },
            { label: '材质', value: 'TPU+纳米涂层' },
            { label: '质保', value: '10年' },
            { label: '施工周期', value: '1-2天' },
          ];
        }
      }
    },

    goStore() {
      uni.switchTab({ url: '/pages/store/store' });
    },

    goReservation() {
      uni.switchTab({ url: '/pages/booking-list/booking-list' });
    },

    goBooking() {
      uni.navigateTo({
        url: `/pages/booking-submit/booking-submit?productId=${this.id}&type=${this.type}&name=${encodeURIComponent(this.item.name || '')}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 80px;
}

.product-gallery {
  height: 350px;
  background: #f0f0f5;
}

.gallery-item,
.gallery-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-icon { font-size: 80px; }

.product-info-section {
  background: #FFFFFF;
  padding: 18px 16px;
  margin-bottom: 10px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-name {
  font-size: 20px;
  font-weight: 700;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
}

.product-price {
  font-size: 22px;
  font-weight: 700;
  color: #C97A18;
  white-space: nowrap;
}

.product-brief {
  font-size: 14px;
  color: #8E8E93;
  margin-top: 8px;
  display: block;
}

.product-meta {
  margin-top: 10px;
}

.meta-tag {
  font-size: 12px;
  color: #D8A04A;
  background: #FEF6EC;
  padding: 3px 12px;
  border-radius: 12px;
}

.desc-section,
.spec-section,
.package-items-section {
  background: #FFFFFF;
  padding: 16px;
  margin-bottom: 10px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon { font-size: 18px; }

.section-title-text {
  font-size: 16px;
  font-weight: 600;
}

.desc-content {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #F2F2F7;
}

.spec-label { font-size: 14px; color: #8E8E93; }
.spec-value { font-size: 14px; color: #111; }

.package-item {
  padding: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-dot { color: #D8A04A; font-weight: 700; }
.item-name { font-size: 14px; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 8px 16px;
  padding-bottom: calc(8px + constant(safe-area-inset-bottom));
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #E5E5EA;
}

.bar-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
}

.bar-icon { font-size: 20px; }
.bar-text { font-size: 11px; color: #8E8E93; }

.book-btn {
  flex: 1;
  height: 44px;
  background: linear-gradient(135deg, #D8A04A, #C97A18);
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(216,160,74,0.3);
}
</style>
