<template>
  <view class="mine-page">
    <!-- 用户信息 -->
    <view class="user-section">
      <view class="user-avatar">
        <text class="avatar-placeholder">{{ userInfo?.nickname?.charAt(0) || '👤' }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo?.nickname || '点击登录' }}</text>
        <text class="user-phone">{{ userInfo?.phone || '' }}</text>
      </view>
      <text class="user-arrow" @click="handleLogin">›</text>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-section">
      <view class="quick-item" @click="goBookingList">
        <text class="quick-icon">📋</text>
        <text class="quick-text">我的预约</text>
      </view>
      <view class="quick-divider"></view>
      <view class="quick-item" @click="goBookingHistory">
        <text class="quick-icon">📜</text>
        <text class="quick-text">历史记录</text>
      </view>
      <view class="quick-divider"></view>
      <view class="quick-item" @click="goStore">
        <text class="quick-icon">🏪</text>
        <text class="quick-text">门店列表</text>
      </view>
    </view>

    <!-- 统计 -->
    <view class="stats-section">
      <view class="stat-item" @click="goBookingList">
        <text class="stat-number">{{ bookingCounts.pending }}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goBookingList">
        <text class="stat-number">{{ bookingCounts.confirmed }}</text>
        <text class="stat-label">已确认</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goBookingList">
        <text class="stat-number">{{ bookingCounts.completed }}</text>
        <text class="stat-label">已完成</text>
      </view>
    </view>

    <!-- 其他菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showContact">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系我们</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showFeedback">
        <text class="menu-icon">💬</text>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userInfo">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      bookingCounts: {
        pending: 0,
        confirmed: 0,
        completed: 0,
      },
    };
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
    this.loadBookingCounts();
  },

  methods: {
    loadUserInfo() {
      try {
        const info = uni.getStorageSync('userInfo');
        this.userInfo = info ? (typeof info === 'string' ? JSON.parse(info) : info) : null;
      } catch {
        this.userInfo = null;
      }
    },

    async loadBookingCounts() {
      try {
        const res = await this.$api.getMyReservations();
        const list = res.data || res.list || res || [];
        this.bookingCounts.pending = list.filter((i) => i.status === 'pending' || i.status === 'contacted').length;
        this.bookingCounts.confirmed = list.filter((i) => i.status === 'confirmed').length;
        this.bookingCounts.completed = list.filter((i) => i.status === 'completed').length;
      } catch (e) {
        // 使用模拟数据
        this.bookingCounts = { pending: 2, confirmed: 1, completed: 4 };
      }
    },

    handleLogin() {
      if (this.userInfo) return;
      // 模拟微信登录
      uni.showModal({
        title: '登录',
        content: '授权获取您的微信昵称和头像？',
        success: (res) => {
          if (res.confirm) {
            const mockUser = { nickname: '蓝辉用户', phone: '138****8888', avatarUrl: '' };
            uni.setStorageSync('userInfo', JSON.stringify(mockUser));
            this.userInfo = mockUser;
            uni.showToast({ title: '登录成功', icon: 'success' });
          }
        },
      });
    },

    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('token');
            this.userInfo = null;
            uni.showToast({ title: '已退出', icon: 'none' });
          }
        },
      });
    },

    goBookingList() {
      uni.switchTab({ url: '/pages/booking-list/booking-list' });
    },

    goBookingHistory() {
      uni.switchTab({ url: '/pages/booking-list/booking-list' });
    },

    goStore() {
      uni.switchTab({ url: '/pages/store/store' });
    },

    showAbout() {
      uni.showModal({
        title: '关于我们',
        content: '蓝辉轻改 - 专业汽车轻改装服务商\n致力于为广大车主提供高品质的汽车轻改装服务。\n\n客服热线：020-12345678',
        showCancel: false,
      });
    },

    showContact() {
      uni.makePhoneCall({ phoneNumber: '020-12345678' });
    },

    showFeedback() {
      uni.showModal({
        title: '意见反馈',
        editable: true,
        placeholderText: '请输入您的宝贵意见...',
        success: (res) => {
          if (res.confirm && res.content) {
            uni.showToast({ title: '感谢您的反馈！', icon: 'success' });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mine-page {
  padding-bottom: 20px;
}

.user-section {
  background: linear-gradient(135deg, #1a2a4a, #2d4a7a);
  padding: 30px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.user-info { flex: 1; }

.user-name {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.user-phone {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
  display: block;
}

.user-arrow { font-size: 24px; opacity: 0.6; }

.quick-section {
  background: #FFFFFF;
  margin: 0 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-top: -10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: relative;
  z-index: 2;
}

.quick-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.quick-icon { font-size: 24px; }
.quick-text { font-size: 12px; color: #111; }

.quick-divider {
  width: 1px;
  height: 30px;
  background: #E5E5EA;
}

.stats-section {
  background: #FFFFFF;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #D8A04A;
}

.stat-label {
  font-size: 12px;
  color: #8E8E93;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #E5E5EA;
}

.menu-section {
  background: #FFFFFF;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F2F2F7;
  gap: 12px;
}

.menu-item:last-child { border-bottom: none; }

.menu-icon { font-size: 20px; }
.menu-text { flex: 1; font-size: 15px; }
.menu-arrow { font-size: 18px; color: #C7C7CC; }

.logout-section {
  padding: 24px 16px;
}

.logout-btn {
  width: 100%;
  height: 44px;
  background: #fff;
  color: #DC2626;
  border: 1px solid #DC2626;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
