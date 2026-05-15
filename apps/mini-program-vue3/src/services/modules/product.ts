import { httpClient } from '@/services/http/client'

export function getProducts(params: Record<string, unknown> = {}) {
  return httpClient.get('/products', { params })
}

export function getProductDetail(id: string) {
  return httpClient.get(`/products/${id}`)
}

export function getPackages(params: Record<string, unknown> = {}) {
  return httpClient.get('/packages', { params })
}

export function getPackageDetail(id: string) {
  return httpClient.get(`/packages/${id}`)
}
