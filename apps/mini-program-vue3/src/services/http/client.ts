import axios from 'axios'
import { uniAdapter } from './uni-adapter'

const isH5 = process.env.UNI_PLATFORM === 'h5'

export const httpClient = axios.create({
  adapter: uniAdapter,
  timeout: 15000,
  baseURL: isH5 ? import.meta.env.VITE_H5_API_BASE_URL : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
    return Promise.reject(error)
  },
)
