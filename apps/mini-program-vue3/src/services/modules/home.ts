import { httpClient } from '@/services/http/client'

export function getHomeConfig() {
  return httpClient.get('/home/config')
}

/** 首页 Tab 切换内容 — 按 tab key 获取对应内容 */
export function getHomeTabContent(tabKey: string) {
  return httpClient.get(`/home/tab/${tabKey}`)
}

/** 首页 Tab 列表定义 */
export function getHomeTabs() {
  return httpClient.get('/home/tabs')
}
