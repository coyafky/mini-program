import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/dashboard/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/views/dashboard/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '概览', icon: 'DataBoard' },
      },
      {
        path: 'stores',
        name: 'Stores',
        component: () => import('@/views/store/StoreList.vue'),
        meta: { title: '门店管理', icon: 'Shop' },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '商品管理', icon: 'Goods' },
      },
      {
        path: 'packages',
        name: 'Packages',
        component: () => import('@/views/package/PackageList.vue'),
        meta: { title: '套餐管理', icon: 'Coin' },
      },
      {
        path: 'bookings',
        name: 'Bookings',
        component: () => import('@/views/booking/BookingList.vue'),
        meta: { title: '预约单管理', icon: 'Calendar' },
      },
      {
        path: 'home-config',
        name: 'HomeConfig',
        component: () => import('@/views/home-config/HomeConfig.vue'),
        meta: { title: '首页配置', icon: 'Setting' },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/Analytics.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.name !== 'Login' && !token) {
    next({ name: 'Login' })
  } else {
    document.title = (to.meta.title as string) + ' - 蓝辉轻改' || '蓝辉轻改'
    next()
  }
})

export default router
