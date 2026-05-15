import axios, { type AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

const api = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return instance.get<T>(url, config).then((response) => response.data)
  },
  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return instance.post<T>(url, data, config).then((response) => response.data)
  },
  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return instance.put<T>(url, data, config).then((response) => response.data)
  },
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return instance.patch<T>(url, data, config).then((response) => response.data)
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<T>(url, config).then((response) => response.data)
  },
}

export default api
