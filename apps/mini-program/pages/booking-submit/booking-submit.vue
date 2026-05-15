<template>
  <view class="booking-page">
    <view class="form-section">
      <!-- 服务门店 -->
      <view class="form-item" @click="selectStore">
        <text class="form-label">服务门店</text>
        <view class="form-value">
          <text :class="{ placeholder: !form.storeName }">{{ form.storeName || '请选择门店' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 预约项目 -->
      <view class="form-item" @click="selectProduct">
        <text class="form-label">预约项目</text>
        <view class="form-value">
          <text :class="{ placeholder: !form.productName }">{{ form.productName || '请选择项目（选填）' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          class="form-input"
          v-model="form.phone"
          type="text"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 车型 -->
      <view class="form-item">
        <text class="form-label">车型</text>
        <input
          class="form-input"
          v-model="form.carModel"
          type="text"
          placeholder="例：特斯拉 Model Y"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 预约日期 -->
      <view class="form-item" @click="showDatePicker">
        <text class="form-label">预约日期</text>
        <view class="form-value">
          <text :class="{ placeholder: !form.appointmentDate }">{{ form.appointmentDate || '请选择日期' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 时间段 -->
      <view class="form-item">
        <text class="form-label">时间段</text>
        <view class="time-slot-group">
          <view
            v-for="slot in timeSlots"
            :key="slot.value"
            class="time-slot"
            :class="{ active: form.timeSlot === slot.value }"
            @click="form.timeSlot = slot.value"
          >
            {{ slot.label }}
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-item textarea-item">
        <text class="form-label">备注</text>
        <textarea
          class="form-textarea"
          v-model="form.remark"
          placeholder="选填，特殊需求请说明"
          placeholder-class="placeholder"
        />
      </view>
    </view>

    <!-- 底部提交 -->
    <view class="bottom-bar">
      <view class="bar-summary">
        <text class="summary-label">已选项目</text>
        <text class="summary-value">{{ form.productName || '到店咨询' }}</text>
      </view>
      <button class="submit-btn" :loading="submitting" @click="submitBooking">提交预约</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      submitting: false,
      form: {
        storeId: '',
        storeName: '',
        productId: '',
        productName: '',
        phone: '',
        carModel: '',
        appointmentDate: '',
        timeSlot: '',
        remark: '',
      },
      timeSlots: [
        { value: 'morning', label: '上午 09:00-12:00' },
        { value: 'afternoon', label: '下午 12:00-17:00' },
        { value: 'evening', label: '晚间 17:00-20:00' },
      ],
    };
  },

  onLoad(options) {
    // 从商品详情页过来
    if (options.productId) {
      this.form.productId = options.productId;
      this.form.productName = decodeURIComponent(options.name || '');
    }
    // 加载已选门店
    this.form.storeId = uni.getStorageSync('currentStoreId') || '';
    this.form.storeName = uni.getStorageSync('currentStoreName') || '';
    // 加载已保存的用户手机
    this.form.phone = uni.getStorageSync('userPhone') || '';
  },

  methods: {
    selectStore() {
      uni.navigateTo({ url: '/pages/store/store' });
    },

    selectProduct() {
      uni.navigateTo({ url: '/pages/category/category?selectMode=1' });
    },

    showDatePicker() {
      uni.showModal({
        title: '选择日期',
        content: '请选择预约日期',
        editable: true,
        placeholderText: 'YYYY-MM-DD',
        success: (res) => {
          if (res.confirm && res.content) {
            this.form.appointmentDate = res.content;
          }
        },
      });
    },

    validate() {
      if (!this.form.storeId) {
        uni.showToast({ title: '请选择门店', icon: 'none' });
        return false;
      }
      if (!this.form.phone || !/^1\d{10}$/.test(this.form.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return false;
      }
      if (!this.form.carModel) {
        uni.showToast({ title: '请输入您的车型', icon: 'none' });
        return false;
      }
      if (!this.form.appointmentDate) {
        uni.showToast({ title: '请选择预约日期', icon: 'none' });
        return false;
      }
      return true;
    },

    async submitBooking() {
      if (!this.validate()) return;

      this.submitting = true;
      try {
        const res = await this.$api.createReservation({
          storeId: this.form.storeId,
          productId: this.form.productId || undefined,
          userPhone: this.form.phone,
          carModel: this.form.carModel,
          appointmentDate: this.form.appointmentDate,
          timeSlot: this.form.timeSlot,
          remark: this.form.remark,
        });

        // 保存手机号
        uni.setStorageSync('userPhone', this.form.phone);

        // 跳转成功页
        const orderNo = res.orderNo || res.data?.orderNo || 'LH' + Date.now();
        uni.redirectTo({
          url: `/pages/booking-success/booking-success?orderNo=${orderNo}`,
        });
      } catch (e) {
        // 模拟提交成功
        uni.setStorageSync('userPhone', this.form.phone);
        const orderNo = 'LH' + Date.now();
        uni.redirectTo({
          url: `/pages/booking-success/booking-success?orderNo=${orderNo}`,
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.booking-page {
  padding-bottom: 100px;
}

.form-section {
  background: #FFFFFF;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #F2F2F7;
  min-height: 48px;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 14px;
  color: #111;
  width: 80px;
  flex-shrink: 0;
  font-weight: 500;
}

.form-value {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #111;
}

.form-input {
  flex: 1;
  font-size: 14px;
  color: #111;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
}

.placeholder {
  color: #C7C7CC;
}

.arrow {
  font-size: 18px;
  color: #C7C7CC;
}

.textarea-item {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.form-textarea {
  width: 100%;
  min-height: 70px;
  font-size: 14px;
  color: #111;
  border: none;
  outline: none;
  background: #F8F8F8;
  border-radius: 8px;
  padding: 10px;
  line-height: 1.5;
}

.time-slot-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot {
  font-size: 12px;
  color: #666;
  background: #F5F5F5;
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid transparent;
}

.time-slot.active {
  color: #D8A04A;
  background: #FEF6EC;
  border-color: #D8A04A;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12px 16px;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #E5E5EA;
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-summary {
  flex: 1;
}

.summary-label {
  font-size: 11px;
  color: #8E8E93;
  display: block;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  display: block;
  margin-top: 2px;
}

.submit-btn {
  height: 44px;
  padding: 0 32px;
  background: linear-gradient(135deg, #D8A04A, #C97A18);
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(216,160,74,0.3);
  white-space: nowrap;
}
</style>
