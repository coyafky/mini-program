// 全局状态管理 - 兼容微信小程序的简单 store
const store = {
  state: {
    currentStoreId: null,
    currentStoreName: null,
    userInfo: null,
    token: null,
    bookingCart: [], // 预约单购物车
  },

  mutations: {
    setCurrentStore(state, { id, name }) {
      state.currentStoreId = id;
      state.currentStoreName = name;
      uni.setStorageSync('currentStoreId', id);
      uni.setStorageSync('currentStoreName', name);
    },
    clearCurrentStore(state) {
      state.currentStoreId = null;
      state.currentStoreName = null;
      uni.removeStorageSync('currentStoreId');
      uni.removeStorageSync('currentStoreName');
    },
    setUserInfo(state, info) {
      state.userInfo = info;
      state.token = info?.token;
      uni.setStorageSync('userInfo', info);
      if (info?.token) uni.setStorageSync('token', info.token);
    },
    clearUserInfo(state) {
      state.userInfo = null;
      state.token = null;
      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('token');
    },
    addToCart(state, product) {
      const existing = state.bookingCart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        state.bookingCart.push({ ...product, quantity: product.quantity || 1 });
      }
    },
    removeFromCart(state, productId) {
      state.bookingCart = state.bookingCart.filter((item) => item.id !== productId);
    },
    clearCart(state) {
      state.bookingCart = [];
    },
  },
};

export default store;
