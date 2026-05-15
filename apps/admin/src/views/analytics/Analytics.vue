<template>
  <div class="analytics">
    <el-row :gutter="16">
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">预约状态分布</h3>
          <div class="status-distribution">
            <div v-for="item in statusDistribution" :key="item.label" class="status-item">
              <span class="status-label">{{ item.label }}</span>
              <el-progress :percentage="item.percentage" :color="item.color" />
              <span class="status-count">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">门店预约分布</h3>
          <div class="store-distribution">
            <div v-for="item in storeDistribution" :key="item.name" class="store-stat-item">
              <span>{{ item.name }}</span>
              <div class="store-bar-bg">
                <div class="store-bar" :style="{ width: (item.percentage || 0) + '%' }"></div>
              </div>
              <span>{{ item.count }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">预约趋势</h3>
          <div class="trend-bars">
            <div v-for="(item, idx) in trend" :key="idx" class="bar-group">
              <div class="bar" :style="{ height: item.height + 'px' }"></div>
              <div class="bar-label">{{ item.date.slice(5) }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">热门项目排行</h3>
          <div v-for="(item, idx) in topProducts" :key="idx" class="rank-item">
            <span class="rank-num">{{ idx + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-count">{{ item.count }} 次预约</span>
          </div>
          <el-empty v-if="!topProducts.length" description="暂无数据" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const statusDistribution = ref([
  { label: '待处理', count: 0, percentage: 0, color: '#eab308' },
  { label: '已联系', count: 0, percentage: 0, color: '#d8a04a' },
  { label: '已确认到店', count: 0, percentage: 0, color: '#3b82f6' },
  { label: '已完成', count: 0, percentage: 0, color: '#17a34a' },
  { label: '已关闭', count: 0, percentage: 0, color: '#9ca4b5' },
])

const storeDistribution = ref<any[]>([])
const trend = ref<any[]>([])
const topProducts = ref<any[]>([])

onMounted(async () => {
  try {
    const overview: any = await api.get('/admin/stats/overview')
    const byStatus = overview.byStatus || {}
    const total = overview.totalReservations || 1
    statusDistribution.value = [
      { label: '待处理', count: byStatus.pending || 0, percentage: Math.round(((byStatus.pending || 0) / total) * 100), color: '#eab308' },
      { label: '已联系', count: byStatus.contacted || 0, percentage: Math.round(((byStatus.contacted || 0) / total) * 100), color: '#d8a04a' },
      { label: '已确认到店', count: byStatus.confirmed || 0, percentage: Math.round(((byStatus.confirmed || 0) / total) * 100), color: '#3b82f6' },
      { label: '已完成', count: byStatus.completed || 0, percentage: Math.round(((byStatus.completed || 0) / total) * 100), color: '#17a34a' },
      { label: '已关闭', count: byStatus.closed || 0, percentage: Math.round(((byStatus.closed || 0) / total) * 100), color: '#9ca4b5' },
    ]

    const storeData: any = await api.get('/admin/stats/stores')
    storeDistribution.value = storeData

    const trendData: any = await api.get('/admin/stats/trend?days=7')
    trend.value = trendData.data.map((count: number, i: number) => ({
      date: trendData.dates[i],
      height: Math.max(count * 40, 8),
    }))

    const products: any = await api.get('/admin/stats/top-products')
    topProducts.value = products
  } catch {}
})
</script>

<style scoped>
.analytics { max-width: 1200px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
.chart-row { margin-top: 16px; }
.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e8ebf4;
  margin-bottom: 16px;
}

.status-distribution { display: flex; flex-direction: column; gap: 16px; }
.status-item { display: flex; align-items: center; gap: 12px; }
.status-label { width: 80px; font-size: 14px; flex-shrink: 0; }
.status-count { width: 40px; text-align: right; font-weight: 600; }

.store-distribution { display: flex; flex-direction: column; gap: 12px; }
.store-stat-item { display: flex; align-items: center; gap: 12px; font-size: 14px; width: 100%; }
.store-stat-item span:first-child { width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.store-bar-bg { flex: 1; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
.store-bar { height: 100%; background: linear-gradient(90deg, #d8a04a, #c97a18); border-radius: 10px; transition: width 0.5s; }
.store-stat-item span:last-child { width: 40px; text-align: right; font-weight: 600; }

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 200px;
  padding: 20px 12px;
}
.bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.bar { width: 40px; border-radius: 8px 8px 4px 4px; background: linear-gradient(180deg, #f4ce88, #d28a22); min-height: 8px; }
.bar-label { font-size: 12px; color: #7e8699; }

.rank-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.rank-num { width: 24px; height: 24px; border-radius: 50%; background: #e8ebf4; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.rank-name { flex: 1; font-size: 14px; }
.rank-count { color: #7e8699; font-size: 13px; }
</style>
