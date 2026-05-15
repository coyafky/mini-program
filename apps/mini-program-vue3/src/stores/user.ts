import { defineStore } from 'pinia'
import { loginByWechat } from '@/services/modules/auth'
import type { UserProfile } from '@/types/entities'

type SessionLoginResult = {
  userId: string
  token: string
  isNewUser?: boolean
}

const USER_INFO_KEY = 'userInfo'
const USER_TOKEN_KEY = 'token'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userId: '',
    userInfo: null as UserProfile | null,
  }),
  actions: {
    restore() {
      const token = uni.getStorageSync(USER_TOKEN_KEY)
      const cachedUser = uni.getStorageSync(USER_INFO_KEY)
      this.token = token || ''
      this.userInfo = cachedUser
        ? (typeof cachedUser === 'string' ? JSON.parse(cachedUser) : cachedUser)
        : null
      this.userId = this.userInfo?.id || ''
    },
    async ensureSession() {
      if (this.token) return

      const session = await loginByWechat('mock_code') as unknown as SessionLoginResult
      this.token = session.token
      this.userId = session.userId
      uni.setStorageSync(USER_TOKEN_KEY, session.token)
    },
    setUserInfo(userInfo: UserProfile | null) {
      this.userInfo = userInfo
      this.userId = userInfo?.id || this.userId
      if (userInfo) {
        uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
      } else {
        uni.removeStorageSync(USER_INFO_KEY)
      }
    },
    logout() {
      this.token = ''
      this.userId = ''
      this.userInfo = null
      uni.removeStorageSync(USER_TOKEN_KEY)
      uni.removeStorageSync(USER_INFO_KEY)
    },
  },
})
