<template>
  <view class="home-page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goSearch">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">搜索商品/套餐/案例</text>
    </view>

    <!-- Banner 轮播 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
      <swiper-item v-for="(banner, index) in banners" :key="index" @click="handleBannerClick(banner)">
        <view class="banner-item" :style="{ background: banner.color || 'linear-gradient(135deg, #1a2a4a, #2d4a7a)' }">
          <text class="banner-text">{{ banner.text || '蓝辉轻改 · 专业轻改装' }}</text>
          <text class="banner-sub">{{ banner.subText || '' }}</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 快捷入口 -->
    <view class="quick-entries">
      <view class="entry-item" v-for="(entry, idx) in quickEntries" :key="idx" @click="handleEntryClick(entry)">
        <view class="entry-icon">{{ entry.icon }}</view>
        <text class="entry-text">{{ entry.name }}</text>
      </view>
    </view>

    <!-- 热门车型 -->
    <view class="section" v-if="hotBrands.length">
      <view class="section-header">
        <text class="section-title">热门车型</text>
        <text class="section-more" @click="goCategory">查看更多 ></text>
      </view>
      <scroll-view class="car-chips" scroll-x>
        <view class="car-chip" v-for="(brand, idx) in hotBrands" :key="idx" @click="goCategory(brand)">
          {{ brand }}
        </view>
      </scroll-view>
    </view>

    <!-- 热门项目 -->
    <view class="section" v-if="hotProducts.length">
      <view class="section-header">
        <text class="section-title">热门项目</text>
        <text class="section-more" @click="goProductList">查看更多 ></text>
      </view>
      <scroll-view class="product-scroll" scroll-x>
        <view class="product-card" v-for="(product, idx) in hotProducts" :key="idx" @click="goProductDetail(product.id)">
          <view class="product-img-placeholder">🚗</view>
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-price">{{ product.priceDescription }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 热门套餐 -->
    <view class="section" v-if="hotPackages.length">
      <view class="section-header">
        <text class="section-title">精选套餐</text>
        <text class="section-more" @click="goPackageList">查看更多 ></text>
      </view>
      <scroll-view class="product-scroll" scroll-x>
        <view class="product-card" v-for="(pkg, idx) in hotPackages" :key="idx" @click="goProductDetail(pkg.id, true)">
          <view class="product-img-placeholder">📦</view>
          <view class="product-info">
            <text class="product-name">{{ pkg.name }}</text>
            <text class="product-price">¥{{ pkg.price }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 门店入口 -->
    <view class="store-entry" @click="goStore">
      <text class="store-entry-icon">🏪</text>
      <view class="store-entry-info">
        <text class="store-entry-title">{{ currentStoreName || '选择服务门店' }}</text>
        <text class="store-entry-sub">{{ currentStoreName ? '点击更换门店' : '点击选择离您最近的门店' }}</text>
      </view>
      <text class="store-entry-arrow">›</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStoreName: '',
      banners: [
        { text: '蓝辉轻改 · 专业轻改装', subText: '品质服务 · 品牌保障', color: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)' },
        { text: '新车到店改装特惠', subText: '全场8折起 · 限时优惠', color: 'linear-gradient(135deg, #6b4a1e, #d8a04a)' },
      ],
      quickEntries: [
        { icon: '🚗', name: '隐形车衣', path: 'product-list' },
        { icon: '🪟', name: '隔热膜', path: 'product-list' },
        { icon: '💺', name: '内饰改装', path: 'product-list' },
        { icon: '💡', name: '氛围灯', path: 'product-list' },
      ],
      hotBrands: ['问界', '理想', '小米SU7', '比亚迪', '特斯拉', '蔚来', '极氪'],
      hotProducts: [],
      hotPackages: [],
    };
  },

  onLoad() {
    this.currentStoreName = uni.getStorageSync('currentStoreName') || '';
    this.fetchHomeData();
  },

  onShow() {
    this.currentStoreName = uni.getStorageSync('currentStoreName') || '';
  },

  methods: {
    async fetchHomeData() {
      try {
        const config = await this.$api.getHomeConfig();
        if (config.hotProducts) this.hotProducts = config.hotProducts;
        if (config.hotPackages) this.hotPackages = config.hotPackages;
        if (config.banners) this.banners = config.banners;
        if (config.hotBrands) this.hotBrands = config.hotBrands;
      } catch (e) {
        // 使用默认数据
        console.log('使用默认首页数据');
      }
    },

    goSearch() {
      uni.navigateTo({ url: '/pages/search/search' });
    },

    handleBannerClick(banner) {
      if (banner.link) {
        uni.navigateTo({ url: banner.link });
      }
    },

    handleEntryClick(entry) {
      uni.switchTab({ url: '/pages/category/category' });
    },

    goCategory(brand) {
      uni.switchTab({ url: '/pages/category/category' });
    },

    goProductList() {
      uni.switchTab({ url: '/pages/category/category' });
    },

    goPackageList() {
      uni.switchTab({ url: '/pages/category/category' });
    },

    goProductDetail(id, isPackage = false) {
      const prefix = isPackage ? 'package' : 'product';
      uni.navigateTo({ url: `/pages/product-detail/product-detail?id=${id}&type=${prefix}` });
    },

    goStore() {
      uni.switchTab({ url: '/pages/store/store' });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: calc(50px + 20px);
}

.search-bar {
  margin: 12px 16px;
  padding: 10px 16px;
  background: #FFFFFF;
  border-radius: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.search-icon { font-size: 16px; }
.search-placeholder { font-size: 14px; color: #8E8E93; }

.banner {
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
  height: 180px;
}
.banner-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.banner-text { font-size: 22px; font-weight: 700; }
.banner-sub { font-size: 14px; margin-top: 8px; opacity: 0.8; }

.quick-entries {
  display: flex;
  padding: 16px;
  gap: 8px;
}
.entry-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.entry-icon { font-size: 28px; }
.entry-text { font-size: 12px; color: #111; }

.section { padding: 8px 0; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
}
.section-title { font-size: 17px; font-weight: 600; }
.section-more { font-size: 13px; color: #D8A04A; }

.car-chips {
  display: flex;
  gap: 10px;
  padding: 0 16px;
  white-space: nowrap;
}
.car-chip {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  background: #FFFFFF;
  border: 1px solid #E5E5EA;
}

.product-scroll {
  display: flex;
  padding: 0 16px;
  white-space: nowrap;
}
.product-card {
  display: inline-block;
  width: 140px;
  margin-right: 10px;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.product-img-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #e8e0f0, #d0d8e8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.product-info { padding: 8px 10px; }
.product-name { font-size: 13px; font-weight: 500; display: block; margin-bottom: 4px; }
.product-price { font-size: 13px; font-weight: 600; color: #C97A18; }

.store-entry {
  margin: 16px;
  padding: 14px;
  background: #FFFFFF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1.5px solid #D8A04A;
}
.store-entry-icon { font-size: 24px; }
.store-entry-info { flex: 1; }
.store-entry-title { font-size: 15px; font-weight: 600; display: block; }
.store-entry-sub { font-size: 12px; color: #8E8E93; margin-top: 2px; display: block; }
.store-entry-arrow { font-size: 20px; color: #D8A04A; }
</style>
