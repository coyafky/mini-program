<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.label">
        <div class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-note">{{ stat.note }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 预约转化漏斗 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">预约转化漏斗</h3>
          <div v-for="(step, idx) in funnel" :key="idx" class="funnel-step" :style="{ width: step.rate, background: funnelColors[idx] }">
            <strong>{{ step.stage }}</strong>
            <span>{{ step.count }} 单 ({{ step.rate }})</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">待办事项</h3>
          <div class="todo-list">
            <div class="todo-item" v-for="todo in todos" :key="todo.text">
              <el-tag :type="todo.type" size="small">{{ todo.tag }}</el-tag>
              <span>{{ todo.text }}</span>
            </div>
            <el-empty v-if="!todos.length" description="暂无待办事项" />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 预约趋势 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="24">
        <div class="card">
          <h3 class="card-title">预约趋势（近7天）</h3>
          <div class="trend-bars">
            <div v-for="(item, idx) in trend" :key="idx" class="bar-group">
              <div class="bar" :style="{ height: item.height + 'px' }"></div>
              <div class="bar-label">{{ item.date.slice(5) }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

type StatCard = {
  label: string
  value: string
  color: string
  note: string
}

type OverviewResponse = {
  totalReservations: number
  byStatus: {
    pending: number
    contacted: number
    confirmed: number
    completed: number
    closed: number
  }
  stores: number
}

type FunnelItem = {
  stage: string
  count: number
  rate: string
}

type TrendResponse = {
  dates: string[]
  data: number[]
}

type TrendItem = {
  date: string
  height: number
}

type TodoItem = {
  text: string
  tag: string
  type: 'warning' | 'success' | 'info' | 'primary' | 'danger'
}

const stats = ref<StatCard[]>([
  { label: '预约单总量', value: '0', color: '#d8a04a', note: '累计预约' },
  { label: '待处理', value: '0', color: '#eab308', note: '待处理预约' },
  { label: '已完成', value: '0', color: '#17a34a', note: '已完成预约' },
  { label: '门店数', value: '0', color: '#3b82f6', note: '活跃门店' },
])

const funnel = ref<FunnelItem[]>([
  { stage: '提交预约', count: 0, rate: '100%' },
  { stage: '已联系', count: 0, rate: '0%' },
  { stage: '已确认到店', count: 0, rate: '0%' },
  { stage: '已完成', count: 0, rate: '0%' },
])

const funnelColors = ['#30384c', '#57627f', '#7782a4', 'linear-gradient(135deg, #d8a04a, #c97a18)']
const todos = ref<TodoItem[]>([])
const trend = ref<TrendItem[]>([])

onMounted(async () => {
  try {
    const overview = await api.get<OverviewResponse>('/admin/stats/overview')
    stats.value = [
      { label: '预约单总量', value: String(overview.totalReservations || 0), color: '#d8a04a', note: '累计预约' },
      { label: '待处理', value: String(overview.byStatus?.pending || 0), color: '#eab308', note: '待处理预约' },
      { label: '已完成', value: String(overview.byStatus?.completed || 0), color: '#17a34a', note: '已完成预约' },
      { label: '门店数', value: String(overview.stores || 0), color: '#3b82f6', note: '活跃门店' },
    ]

    const funnelData = await api.get<FunnelItem[]>('/admin/stats/funnel')
    funnel.value = funnelData

    const trendData = await api.get<TrendResponse>('/admin/stats/trend?days=7')
    trend.value = trendData.data.map((count: number, i: number) => ({
      date: trendData.dates[i],
      height: Math.max(count * 40, 10),
    }))

    // 如果有待处理预约，显示待办
    if (overview.byStatus?.pending > 0) {
      todos.value.push({
        text: `${overview.byStatus.pending} 条预约单待处理`,
        tag: '待处理',
        type: 'warning',
      })
    }
  } catch (e) {
    console.log('统计数据加载失败，使用默认数据')
  }
})
</script>

<style scoped>
.dashboard { max-width: 1200px; }
.stats-row { margin-bottom: 16px; }
.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid #e8ebf4;
}
.stat-label { color: #7e8699; font-size: 13px; font-weight: 600; }
.stat-value { margin-top: 8px; font-size: 28px; font-weight: 800; }
.stat-note { margin-top: 8px; color: #9ca4b5; font-size: 12px; }
.chart-row { margin-top: 16px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }

.funnel-step {
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  margin-bottom: 8px;
  font-weight: 600;
  min-width: 60%;
}
.funnel-step strong { display: block; font-size: 14px; }
.funnel-step span { display: block; margin-top: 4px; font-size: 12px; opacity: 0.8; }

.todo-list { display: flex; flex-direction: column; gap: 12px; }
.todo-item { display: flex; align-items: center; gap: 10px; font-size: 14px; }

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 200px;
  padding: 20px 12px;
}
.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.bar {
  width: 40px;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, #f4ce88, #d28a22);
  min-height: 8px;
}
.bar-label { font-size: 12px; color: #7e8699; }
</style>
