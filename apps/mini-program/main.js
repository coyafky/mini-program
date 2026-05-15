import Vue from 'vue';
import App from './App';
import store from './store';
import { api } from './api/index';

// 挂载全局
Vue.prototype.$api = api;
Vue.prototype.$store = store;

// 全局过滤器
Vue.filter('formatDate', (value) => {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});

Vue.filter('statusText', (status) => {
  const map = {
    pending: '待处理',
    contacted: '已联系',
    confirmed: '已确认到店',
    completed: '已完成',
    closed: '已关闭',
  };
  return map[status] || status;
});

// 挂载全局样式变量
const app = new Vue({
  ...App,
});
app.$mount();
