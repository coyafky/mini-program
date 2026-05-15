<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useStoreStore } from '@/stores/store'
import { useUserStore } from '@/stores/user'

const storeStore = useStoreStore()
const userStore = useUserStore()

onLaunch(async () => {
  storeStore.restore()
  userStore.restore()
  await userStore.ensureSession()
})

onShow(() => {
  storeStore.restore()
})

onHide(() => {
  // no-op
})
</script>

<style lang="scss">
page {
  background-color: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  color: #111111;
  -webkit-font-smoothing: antialiased;
}

view,
text,
image,
button,
input,
textarea {
  box-sizing: border-box;
}
</style>
