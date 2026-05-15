import { httpClient } from '@/services/http/client'

export function loginByWechat(code = 'mock_code') {
  return httpClient.post('/auth/login-by-wechat', { code })
}
