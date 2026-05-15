// API 基础配置
const BASE_URL = 'http://localhost:3000/api/v1';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.header,
    };

    uni.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // token 过期, 清除登录态
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          reject(new Error('登录已过期'));
        } else {
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'));
      },
    });
  });
}

export const api = {
  // ====== 首页 ======
  getHomeConfig() {
    return request('/home/config');
  },

  // ====== 门店 ======
  getStores() {
    return request('/stores/active');
  },
  getStoreDetail(id) {
    return request(`/stores/${id}`);
  },
  getStoreProducts(storeId, category) {
    const params = category ? `?category=${category}` : '';
    return request(`/stores/${storeId}/products${params}`);
  },

  // ====== 商品 ======
  getProducts(params = {}) {
    const query = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return request(`/products?${query}`);
  },
  getProductDetail(id) {
    return request(`/products/${id}`);
  },

  // ====== 套餐 ======
  getPackages(params = {}) {
    const query = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return request(`/packages?${query}`);
  },
  getPackageDetail(id) {
    return request(`/packages/${id}`);
  },

  // ====== 预约单 ======
  createReservation(data) {
    return request('/reservations', { method: 'POST', data });
  },
  getMyReservations(status) {
    const query = status ? `?status=${status}` : '';
    return request(`/reservations${query}`);
  },
  getReservationDetail(id) {
    return request(`/reservations/${id}`);
  },

  // ====== 认证 ======
  wechatLogin(code) {
    return request('/auth/login-by-wechat', {
      method: 'POST',
      data: { code },
    });
  },
  bindPhone(phone, code) {
    return request('/users/bind-phone', {
      method: 'POST',
      data: { phone, code },
    });
  },

  // ====== 用户 ======
  getUserProfile() {
    return request('/users/profile');
  },
};

export default api;
