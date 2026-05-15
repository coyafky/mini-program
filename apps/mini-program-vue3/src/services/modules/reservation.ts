import { httpClient } from '@/services/http/client'

export function createReservation(data: Record<string, unknown>) {
  return httpClient.post('/reservations', data)
}

export function getMyReservations(status?: string) {
  return httpClient.get('/reservations', {
    params: status ? { status } : undefined,
  })
}

export function getReservationDetail(id: string) {
  return httpClient.get(`/reservations/${id}`)
}
