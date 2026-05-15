import { createSSRApp } from 'vue'
import App from '@/App.vue'
import { setupStores } from '@/stores'

export function createApp() {
  const app = createSSRApp(App)
  setupStores(app)

  return {
    app,
  }
}
