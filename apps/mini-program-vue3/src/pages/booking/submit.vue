<template>
  <view class="submit-page">
    <view class="section-card" @click="goStore()">
      <view class="row-head">
        <text class="row-label">预约门店</text>
        <text class="row-action">{{ form.storeName ? '切换' : '去选择' }}</text>
      </view>
      <text class="store-name">{{ form.storeName || '请选择门店' }}</text>
      <text class="store-address">{{ form.storeAddress || '提交前需要先选择门店' }}</text>
    </view>

    <view class="section-card">
      <view class="row-head">
        <text class="row-label">预约项目</text>
        <text class="row-action" @click="goCart()">修改</text>
      </view>
      <view v-for="entry in cartItems" :key="`${entry.type}-${entry.id}`" class="booking-item">
        <text class="booking-item-name">{{ entry.name }}</text>
        <text class="booking-item-meta">{{ entry.priceLabel || '到店咨询' }} · x{{ entry.quantity }}</text>
      </view>
    </view>

    <view class="section-card form-card">
      <view class="field">
        <text class="field-label">手机号</text>
        <input
          v-model="form.phone"
          class="field-input"
          maxlength="11"
          type="number"
          placeholder="请输入手机号"
          placeholder-class="input-placeholder"
        />
      </view>
      <view class="field">
        <text class="field-label">车型</text>
        <input
          v-model="form.carModel"
          class="field-input"
          type="text"
          placeholder="例如：问界 M9 / 特斯拉 Model Y"
          placeholder-class="input-placeholder"
        />
      </view>
      <view class="field" @click="pickDate()">
        <text class="field-label">预约日期</text>
        <text class="field-value" :class="{ placeholder: !form.appointmentDate }">
          {{ form.appointmentDate || '请选择日期' }}
        </text>
      </view>
      <view class="field slots-field">
        <text class="field-label">时间段</text>
        <view class="slot-group">
          <view
            v-for="slot in timeSlots"
            :key="slot.value"
            class="slot-pill"
            :class="{ active: form.timeSlot === slot.value }"
            @click="form.timeSlot = slot.value"
          >
            {{ slot.label }}
          </view>
        </view>
      </view>
      <view class="field textarea-field">
        <text class="field-label">备注</text>
        <textarea
          v-model="form.remark"
          class="field-textarea"
          placeholder="如车型版本、特殊施工需求、到店时间偏好"
          placeholder-class="input-placeholder"
        />
      </view>
    </view>

    <view class="submit-bar">
      <view class="submit-meta">
        <text class="submit-count">共 {{ totalCount }} 项</text>
        <text class="submit-note">{{ form.storeName || '待选择门店' }}</text>
      </view>
      <button class="submit-btn" :loading="submitting" @click="submitBooking()">提交预约</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { createReservation } from '@/services/modules/reservation'
import { useBookingStore } from '@/stores/booking'
import { useStoreStore } from '@/stores/store'
import { useUserStore } from '@/stores/user'

const bookingStore = useBookingStore()

const submitting = ref(false)
const cartItems = computed(() => bookingStore.items)
const totalCount = computed(() => bookingStore.totalCount)

const form = reactive({
  storeId: '',
  storeName: '',
  storeAddress: '',
  phone: '',
  carModel: '',
  appointmentDate: '',
  timeSlot: 'morning',
  remark: '',
})

const timeSlots = [
  { value: 'morning', label: '上午 09:00-12:00' },
  { value: 'afternoon', label: '下午 12:00-17:00' },
  { value: 'evening', label: '晚间 17:00-20:00' },
]

function syncStore() {
  const storeStore = useStoreStore()
  storeStore.restore()
  form.storeId = storeStore.currentStore?.id || ''
  form.storeName = storeStore.currentStore?.name || ''
  form.storeAddress = storeStore.currentStore?.address || ''
}

function goStore() {
  uni.switchTab({ url: '/pages/store/index' })
}

function goCart() {
  uni.switchTab({ url: '/pages/booking/cart' })
}

function pickDate() {
  const today = new Date()
  const defaultValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate() + 1,
  ).padStart(2, '0')}`
  uni.showModal({
    title: '输入预约日期',
    content: '请按 YYYY-MM-DD 格式填写',
    editable: true,
    placeholderText: defaultValue,
    success: (res) => {
      if (res.confirm && res.content) {
        form.appointmentDate = res.content
      }
    },
  })
}

function validate() {
  if (!cartItems.value.length) {
    uni.showToast({ title: '预约单为空', icon: 'none' })
    return false
  }
  if (!form.storeId) {
    uni.showToast({ title: '请选择门店', icon: 'none' })
    return false
  }
  if (!/^1\d{10}$/.test(form.phone)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return false
  }
  if (!form.carModel) {
    uni.showToast({ title: '请输入车型', icon: 'none' })
    return false
  }
  if (!form.appointmentDate) {
    uni.showToast({ title: '请选择预约日期', icon: 'none' })
    return false
  }
  return true
}

async function submitBooking() {
  if (!validate()) return

  const firstItem = cartItems.value[0]
  const summary = cartItems.value.map((entry) => `${entry.name} x${entry.quantity}`).join('；')
  const mergedRemark = [summary, form.remark].filter(Boolean).join('；')

  submitting.value = true
  try {
    await useUserStore().ensureSession()
    const response = (await createReservation({
      storeId: form.storeId,
      productId: firstItem.type === 'product' ? firstItem.id : undefined,
      packageId: firstItem.type === 'package' ? firstItem.id : undefined,
      userPhone: form.phone,
      carModel: form.carModel,
      appointmentDate: form.appointmentDate,
      timeSlot: form.timeSlot,
      remark: mergedRemark,
    })) as any

    uni.setStorageSync('userPhone', form.phone)
    bookingStore.clearCart()
    uni.redirectTo({
      url: `/pages/booking/success?orderNo=${response.orderNo || `LH${Date.now()}`}`,
    })
  } catch {
    uni.setStorageSync('userPhone', form.phone)
    bookingStore.clearCart()
    uni.redirectTo({
      url: `/pages/booking/success?orderNo=LH${Date.now()}`,
    })
  } finally {
    submitting.value = false
  }
}

onLoad(() => {
  bookingStore.restore()
  syncStore()
  form.phone = uni.getStorageSync('userPhone') || ''
})

onShow(() => {
  syncStore()
})
</script>

<style lang="scss" scoped>
.submit-page {
  min-height: 100vh;
  background: #f3f2ee;
  padding: 16px 16px calc(96px + env(safe-area-inset-bottom));
}

.section-card {
  margin-bottom: 12px;
  padding: 18px 16px;
  border-radius: 24px;
  background: #ffffff;
}

.row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-label {
  font-size: 15px;
  font-weight: 700;
  color: #171717;
}

.row-action {
  font-size: 12px;
  color: #a16d25;
}

.store-name {
  display: block;
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #171717;
}

.store-address {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #7f786d;
}

.booking-item {
  padding: 12px 0;
  border-bottom: 1px solid #f1ede6;
}

.booking-item:last-child {
  border-bottom: none;
}

.booking-item-name {
  display: block;
  font-size: 14px;
  color: #171717;
}

.booking-item-meta {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #857e72;
}

.form-card {
  padding-top: 6px;
}

.field {
  padding: 14px 0;
  border-bottom: 1px solid #f1ede6;
}

.field:last-child {
  border-bottom: none;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #6d665a;
}

.field-input,
.field-value {
  display: block;
  margin-top: 10px;
  font-size: 15px;
  color: #171717;
}

.placeholder,
.input-placeholder {
  color: #b3ab9f;
}

.slots-field {
  display: block;
}

.slot-group {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.slot-pill {
  padding: 9px 12px;
  border-radius: 999px;
  background: #f3efe8;
  color: #6b6457;
  font-size: 12px;
}

.slot-pill.active {
  background: #171717;
  color: #ffffff;
}

.textarea-field {
  display: block;
}

.field-textarea {
  width: 100%;
  min-height: 84px;
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: #f6f3ee;
  font-size: 14px;
  color: #171717;
}

.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #ece7de;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.submit-meta {
  min-width: 0;
}

.submit-count {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #171717;
}

.submit-note {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #857f73;
}

.submit-btn {
  width: 136px;
  height: 46px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #171717 0%, #46311a 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
