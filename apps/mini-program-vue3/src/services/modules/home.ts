import { httpClient } from '@/services/http/client'

export function getHomeConfig() {
  return httpClient.get('/home/config')
}
