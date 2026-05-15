<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">🏎️ 蓝辉轻改</div>
      <nav class="sidebar-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="sidebar-item"
          :class="{ active: currentRoute === item.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="topbar">
        <h3>{{ currentTitle }}</h3>
        <div class="topbar-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ adminUser?.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const adminUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('admin_user') || '{}')
  } catch { return {} }
})

const currentRoute = computed(() => route.path)
const currentTitle = computed(() => route.meta.title as string || '')

const menuItems = [
  { path: '/dashboard', title: '概览', icon: 'DataBoard' },
  { path: '/stores', title: '门店管理', icon: 'Shop' },
  { path: '/products', title: '商品管理', icon: 'Goods' },
  { path: '/packages', title: '套餐管理', icon: 'Coin' },
  { path: '/bookings', title: '预约单管理', icon: 'Calendar' },
  { path: '/home-config', title: '首页配置', icon: 'Setting' },
  { path: '/analytics', title: '数据统计', icon: 'DataAnalysis' },
]

function handleLogout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/login')
}
</script>

<style scoped>
.layout { display: flex; }

.sidebar {
  width: 240px;
  height: 100vh;
  background: #1a1d29;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 24px 20px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 2px;
}

.sidebar-menu { padding: 12px 0; }

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 14px;
  gap: 12px;
  transition: all 0.2s;
  cursor: pointer;
  border-right: 3px solid transparent;
}

.sidebar-item:hover {
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.sidebar-item.active {
  color: #d8a04a;
  background: rgba(216,160,74,0.1);
  border-right-color: #d8a04a;
}

.main-content {
  margin-left: 240px;
  flex: 1;
  min-height: 100vh;
  background: #f6f7fb;
}

.topbar {
  background: #fff;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8ebf4;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar h3 { font-size: 18px; font-weight: 700; color: #1f2430; }

.topbar-right { display: flex; align-items: center; gap: 16px; }

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username { font-size: 14px; font-weight: 500; }

.page-content { padding: 24px 28px; }
</style>
