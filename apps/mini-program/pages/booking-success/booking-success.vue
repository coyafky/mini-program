<template>
  <view class="success-page">
    <view class="success-card">
      <view class="success-icon">✅</view>
      <text class="success-title">预约提交成功</text>
      <text class="success-subtitle">我们将尽快与您联系确认</text>

      <view class="order-info">
        <view class="order-row">
          <text class="order-label">预约单号</text>
          <text class="order-value">{{ orderNo }}</text>
        </view>
        <view class="order-row">
          <text class="order-label">提交时间</text>
          <text class="order-value">{{ submitTime }}</text>
        </view>
      </view>
    </view>

    <view class="tip-section">
      <text class="tip-title">📌 温馨提示</text>
      <text class="tip-text">1. 工作人员将在1小时内与您电话确认</text>
      <text class="tip-text">2. 如需修改时间，请提前2小时联系我们</text>
      <text class="tip-text">3. 到店后请出示预约单号以便核销</text>
    </view>

    <view class="action-btns">
      <button class="btn btn-primary" @click="goBookingList">查看预约记录</button>
      <button class="btn btn-outline" @click="goHome">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderNo: '',
      submitTime: '',
    };
  },

  onLoad(options) {
    this.orderNo = options.orderNo || 'LH' + Date.now();
    const now = new Date();
    this.submitTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  },

  methods: {
    goBookingList() {
      uni.switchTab({ url: '/pages/booking-list/booking-list' });
    },

    goHome() {
      uni.switchTab({ url: '/pages/index/index' });
    },
  },
};
</script>

<style lang="scss" scoped>
.success-page {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 40px 24px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.success-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
}

.success-subtitle {
  font-size: 14px;
  color: #8E8E93;
  margin-top: 8px;
}

.order-info {
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 10px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.order-label {
  font-size: 13px;
  color: #8E8E93;
}

.order-value {
  font-size: 13px;
  color: #111;
  font-weight: 500;
}

.tip-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
  max-width: 320px;
}

.tip-title {
  font-size: 15px;
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}

.tip-text {
  font-size: 13px;
  color: #666;
  display: block;
  padding: 4px 0;
  line-height: 1.6;
}

.action-btns {
  width: 100%;
  max-width: 320px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #D8A04A, #C97A18);
  color: #fff;
  box-shadow: 0 4px 12px rgba(216,160,74,0.3);
}

.btn-outline {
  background: transparent;
  color: #D8A04A;
  border: 1.5px solid #D8A04A;
}
</style>
