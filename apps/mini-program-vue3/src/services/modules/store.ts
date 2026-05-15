import { httpClient } from '@/services/http/client'

export function getStores() {
  return httpClient.get('/stores/active')
}

export function getStoreDetail(id: string) {
  return httpClient.get(`/stores/${id}`)
}

export function getStoreProducts(storeId: string) {
  return httpClient.get(`/stores/${storeId}/products`)
}
