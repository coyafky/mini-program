import { defineStore } from 'pinia'
import type { BookingCartItem } from '@/types/entities'

const BOOKING_CART_KEY = 'bookingCart'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    items: [] as BookingCartItem[],
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    restore() {
      const cached = uni.getStorageSync(BOOKING_CART_KEY)
      const parsed = cached ? (typeof cached === 'string' ? JSON.parse(cached) : cached) : []
      this.items = Array.isArray(parsed) ? parsed : []
    },

    persist() {
      uni.setStorageSync(BOOKING_CART_KEY, JSON.stringify(this.items))
    },

    addItem(item: BookingCartItem) {
      const existing = this.items.find((entry) => entry.id === item.id && entry.type === item.type)
      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        this.items.unshift({ ...item, quantity: item.quantity || 1 })
      }
      this.persist()
    },

    updateQuantity(id: string, type: BookingCartItem['type'], quantity: number) {
      const target = this.items.find((entry) => entry.id === id && entry.type === type)
      if (!target) return
      if (quantity <= 0) {
        this.removeItem(id, type)
        return
      }
      target.quantity = quantity
      this.persist()
    },

    removeItem(id: string, type: BookingCartItem['type']) {
      this.items = this.items.filter((entry) => !(entry.id === id && entry.type === type))
      this.persist()
    },

    clearCart() {
      this.items = []
      uni.removeStorageSync(BOOKING_CART_KEY)
    },
  },
})
