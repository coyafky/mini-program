import { defineStore } from 'pinia'
import type { StoreItem } from '@/types/entities'

const STORE_ID_KEY = 'currentStoreId'
const STORE_NAME_KEY = 'currentStoreName'
const STORE_ADDRESS_KEY = 'currentStoreAddress'

export const useStoreStore = defineStore('service-store', {
  state: () => ({
    currentStore: null as StoreItem | null,
  }),
  actions: {
    restore() {
      const id = uni.getStorageSync(STORE_ID_KEY)
      const name = uni.getStorageSync(STORE_NAME_KEY)
      const address = uni.getStorageSync(STORE_ADDRESS_KEY)

      if (!id || !name) {
        this.currentStore = null
        return
      }

      this.currentStore = {
        id,
        name,
        address: address || '',
        phone: '',
        businessHours: '',
        status: 1,
      }
    },
    selectStore(store: StoreItem) {
      this.currentStore = store
      uni.setStorageSync(STORE_ID_KEY, store.id)
      uni.setStorageSync(STORE_NAME_KEY, store.name)
      uni.setStorageSync(STORE_ADDRESS_KEY, store.address || '')
    },
    clearStore() {
      this.currentStore = null
      uni.removeStorageSync(STORE_ID_KEY)
      uni.removeStorageSync(STORE_NAME_KEY)
      uni.removeStorageSync(STORE_ADDRESS_KEY)
    },
  },
})
