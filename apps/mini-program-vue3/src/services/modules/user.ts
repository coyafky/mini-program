import { httpClient } from '@/services/http/client'

export function getUserProfile() {
  return httpClient.get('/users/profile')
}

export function bindPhone(phone: string) {
  return httpClient.post('/users/bind-phone', { phone })
}

export function updateUserProfile(data: Record<string, unknown>) {
  return httpClient.put('/users/profile', data)
}
