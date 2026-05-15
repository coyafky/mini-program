<template>
  <view class="detail-page">
    <!-- 状态卡片 -->
    <view class="status-card" :class="booking.status">
      <text class="status-icon">{{ statusIcon }}</text>
      <view class="status-info">
        <text class="status-title">{{ statusText(booking.status) }}</text>
        <text class="status-desc">{{ statusDesc }}</text>
      </view>
    </view>

    <!-- 预约信息 -->
    <view class="info-section">
      <text class="section-title">预约信息</text>
      <view class="info-list">
        <view class="info-row">
          <text class="info-label">预约单号</text>
          <text class="info-value">{{ booking.orderNo }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">服务门店</text>
          <text class="info-value">{{ booking.store?.name || booking.storeName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">门店地址</text>
          <text class="info-value address">{{ booking.store?.address || '查看门店详情' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">预约项目</text>
          <text class="info-value">{{ booking.product?.name || booking.productName || '到店咨询' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">您的车型</text>
          <text class="info-value">{{ booking.carModel }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">联系电话</text>
          <text class="info-value">{{ booking.userPhone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">预约时间</text>
          <text class="info-value">{{ formatDate(booking.appointmentDate) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">时间段</text>
          <text class="info-value">{{ timeSlotText(booking.timeSlot) }}</text>
        </view>
        <view class="info-row" v-if="booking.remark">
          <text class="info-label">备注</text>
          <text class="info-value">{{ booking.remark }}</text>
        </view>
      </view>
    </view>

    <!-- 时间线 -->
    <view class="timeline-section" v-if="statusLogs.length">
      <text class="section-title">处理进度</text>
      <view class="timeline">
        <view class="timeline-item" v-for="(log, idx) in statusLogs" :key="idx">
          <view class="timeline-dot"></view>
          <view class="timeline-content">
            <text class="timeline-status">{{ log.newStatusText || statusText(log.newStatus) }}</text>
            <text class="timeline-time">{{ formatDate(log.createdAt) }}</text>
            <text class="timeline-remark" v-if="log.remark">{{ log.remark }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-bar" v-if="booking.status === 'pending' || booking.status === 'contacted'">
      <button class="btn btn-cancel" @click="cancelBooking">取消预约</button>
      <button class="btn btn-contact" @click="contactStore">联系门店</button>
    </view>
  </view>
</template>

<script>
import { getReservationDetail } from '@/services/modules/reservation'
import { useUserStore } from '@/stores/user'
import { formatDate, statusText, timeSlotText } from '@/utils/format'

export default {
  data() {
    return {
      id: '',
      booking: {},
      statusLogs: [],
    };
  },

  computed: {
    statusIcon() {
      const icons = { pending: '⏳', contacted: '📞', confirmed: '✅', completed: '🎉', closed: '📋' };
      return icons[this.booking.status] || '📋';
    },
    statusDesc() {
      const descs = {
        pending: '等待工作人员联系确认',
        contacted: '已与您电话沟通，等待到店',
        confirmed: '您的预约已确认到店时间',
        completed: '服务已完成，感谢您的信任',
        closed: '该预约单已关闭',
      };
      return descs[this.booking.status] || '';
    },
  },

  onLoad(options) {
    this.id = options.id || '';
    this.loadDetail();
  },

  methods: {
    statusText(status) {
      return statusText(status);
    },

    timeSlotText(slot) {
      return timeSlotText(slot);
    },

    formatDate(date) {
      return formatDate(date, true);
    },

    async loadDetail() {
      try {
        await useUserStore().ensureSession();
        const res = await getReservationDetail(this.id);
        this.booking = res;
        this.statusLogs = this.booking.statusLogs || [];
      } catch (e) {
        // 模拟数据
        this.booking = {
          id: this.id,
          orderNo: 'LH20250101001',
          status: 'confirmed',
          storeName: '蓝辉轻改·旗舰店',
          store: { name: '蓝辉轻改·旗舰店', address: '广州市天河区天河路228号' },
          productName: '隐形车衣（TPU）',
          carModel: '特斯拉 Model Y',
          userPhone: '138****8888',
          appointmentDate: '2025-01-20',
          timeSlot: 'morning',
          remark: '到店后先评估车况',
        };
        this.statusLogs = [
          { newStatus: 'pending', createdAt: '2025-01-10T10:00:00', newStatusText: '提交预约', remark: '用户提交预约单' },
          { newStatus: 'contacted', createdAt: '2025-01-10T10:30:00', newStatusText: '已联系', remark: '已电话确认，预约到店时间' },
          { newStatus: 'confirmed', createdAt: '2025-01-10T11:00:00', newStatusText: '已确认', remark: '确认到店时间：1月20日上午' },
        ];
      }
    },

    cancelBooking() {
      uni.showModal({
        title: '取消预约',
        content: '确定要取消该预约吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已取消预约', icon: 'success' });
            setTimeout(() => uni.navigateBack(), 1000);
          }
        },
      });
    },

    contactStore() {
      uni.makePhoneCall({
        phoneNumber: this.booking.store?.phone || '020-12345678',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 100px;
}

.status-card {
  margin: 16px;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.status-card.pending { background: linear-gradient(135deg, #EAB308, #F59E0B); }
.status-card.contacted { background: linear-gradient(135deg, #3B82F6, #2563EB); }
.status-card.confirmed { background: linear-gradient(135deg, #17A34A, #15803D); }
.status-card.completed { background: linear-gradient(135deg, #8E8E93, #636366); }
.status-card.closed { background: linear-gradient(135deg, #A1A1AA, #71717A); }

.status-icon { font-size: 40px; }

.status-info { flex: 1; }

.status-title {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.status-desc {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 4px;
  display: block;
}

.info-section,
.timeline-section {
  background: #FFFFFF;
  margin: 0 16px 12px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 14px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #F2F2F7;
}

.info-row:last-child { border-bottom: none; }

.info-label {
  font-size: 13px;
  color: #8E8E93;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  font-size: 13px;
  color: #111;
  flex: 1;
}

.info-value.address {
  color: #D8A04A;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #E5E5EA;
}

.timeline-item {
  position: relative;
  padding-bottom: 16px;
}

.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -16px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #D8A04A;
  border: 2px solid #FEF6EC;
}

.timeline-content { }

.timeline-status {
  font-size: 14px;
  font-weight: 600;
  display: block;
}

.timeline-time {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 2px;
  display: block;
}

.timeline-remark {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 1px solid #E5E5EA;
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #F2F2F7;
  color: #666;
}

.btn-contact {
  background: linear-gradient(135deg, #D8A04A, #C97A18);
  color: #fff;
  box-shadow: 0 4px 12px rgba(216,160,74,0.3);
}
</style>
