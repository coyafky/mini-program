<template>
  <div class="booking-manage">
    <div class="toolbar">
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width:130px">
        <el-option label="待处理" value="pending" />
        <el-option label="已联系" value="contacted" />
        <el-option label="已确认到店" value="confirmed" />
        <el-option label="已完成" value="completed" />
        <el-option label="已关闭" value="closed" />
      </el-select>
      <el-select v-model="filterStore" placeholder="门店" clearable style="width:160px">
        <el-option v-for="s in stores" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:240px" />
    </div>

    <el-table :data="bookings" border stripe style="width: 100%">
      <el-table-column prop="orderNo" label="预约单号" width="160" />
      <el-table-column prop="store.name" label="门店" min-width="120" />
      <el-table-column label="手机号" prop="userPhone" width="130" />
      <el-table-column label="车型" prop="carModel" width="130" />
      <el-table-column label="预约日期" width="120">
        <template #default="{ row }">{{ row.appointmentDate?.slice(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="160">
        <template #default="{ row }">{{ row.createdAt?.slice(0, 16) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDetail" title="预约单详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预约单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(detail.status)">{{ statusText(detail.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="门店">{{ detail.store?.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detail.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="车型">{{ detail.carModel }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ detail.appointmentDate?.slice(0, 10) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detail.remark || '无' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注" :span="2">{{ detail.handleRemark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />
      <h4>更新状态</h4>
      <div class="status-update">
        <el-select v-model="newStatus" placeholder="选择新状态" style="width:160px">
          <el-option label="待处理" value="pending" />
          <el-option label="已联系" value="contacted" />
          <el-option label="已确认到店" value="confirmed" />
          <el-option label="已完成" value="completed" />
          <el-option label="已关闭" value="closed" />
        </el-select>
        <el-input v-model="handleRemark" placeholder="处理备注" style="width:200px" />
        <el-button type="primary" @click="handleUpdateStatus">更新状态</el-button>
      </div>

      <el-divider />
      <h4>状态变更记录</h4>
      <el-timeline>
        <el-timeline-item v-for="(log, idx) in detail.statusLogs || []" :key="idx" :timestamp="log.createdAt?.slice(0, 16)">
          {{ statusText(log.oldStatus || '') }} → {{ statusText(log.newStatus) }}
          <span v-if="log.remark">: {{ log.remark }}</span>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const filterStatus = ref('')
const filterStore = ref('')
const dateRange = ref(null)
const bookings = ref<any[]>([])
const stores = ref<any[]>([])
const showDetail = ref(false)
const detail = ref<any>({})
const newStatus = ref('')
const handleRemark = ref('')

function statusText(status: string) {
  const map: Record<string, string> = {
    pending: '待处理', contacted: '已联系', confirmed: '已确认到店',
    completed: '已完成', closed: '已关闭',
  }
  return map[status] || status
}

function statusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning', contacted: '', confirmed: 'success',
    completed: 'info', closed: 'info',
  }
  return map[status] || 'info'
}

async function fetchBookings() {
  try {
    const params: any = { pageSize: 200 }
    if (filterStatus.value) params.status = filterStatus.value
    if (filterStore.value) params.storeId = filterStore.value
    const res: any = await api.get('/admin/reservations', { params })
    bookings.value = res.list || []
  } catch {}
}

async function fetchStores() {
  try {
    const res: any = await api.get('/admin/stores')
    stores.value = res.list || []
  } catch {}
}

async function handleDetail(row: any) {
  try {
    const res: any = await api.get(`/admin/reservations/${row.id}`)
    detail.value = res
    newStatus.value = ''
    handleRemark.value = ''
    showDetail.value = true
  } catch {}
}

async function handleUpdateStatus() {
  if (!newStatus.value) { ElMessage.warning('请选择状态'); return }
  try {
    await api.patch(`/admin/reservations/${detail.value.id}/status`, {
      status: newStatus.value,
      handleRemark: handleRemark.value,
    })
    ElMessage.success('状态更新成功')
    showDetail.value = false
    fetchBookings()
  } catch {
    ElMessage.error('更新失败')
  }
}

watch([filterStatus, filterStore], () => fetchBookings())

onMounted(() => {
  fetchBookings()
  fetchStores()
})
</script>

<style scoped>
.booking-manage { max-width: 1200px; }
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.status-update {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  align-items: center;
}
h4 { margin-bottom: 8px; }
</style>
