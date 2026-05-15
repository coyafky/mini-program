<script>
export default {
  onLaunch() {
    console.log('App Launch');
    // 初始化全局数据
    this.initApp();
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  methods: {
    initApp() {
      // Store 是纯 JS 对象（非 Vuex），直接调用 mutations 方法
      const storeId = uni.getStorageSync('currentStoreId');
      const storeName = uni.getStorageSync('currentStoreName');
      if (storeId && this.$store) {
        this.$store.mutations.setCurrentStore(this.$store.state, { id: storeId, name: storeName });
      }
    }
  }
};
</script>

<style>
/* 全局样式 */
page {
  background-color: #F2F2F7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  color: #111111;
  -webkit-font-smoothing: antialiased;
}

view,
text,
image {
  box-sizing: border-box;
}

/* 自定义字体图标 */
@font-face {
  font-family: 'iconfont';
  src: url('/static/iconfont.ttf') format('truetype');
}
</style>
