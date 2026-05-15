export function formatDate(date?: string | Date | null, withTime = false) {
  if (!date) return ''
  const target = typeof date === 'string' ? new Date(date) : date
  const y = target.getFullYear()
  const m = String(target.getMonth() + 1).padStart(2, '0')
  const d = String(target.getDate()).padStart(2, '0')

  if (!withTime) {
    return `${y}-${m}-${d}`
  }

  const h = String(target.getHours()).padStart(2, '0')
  const mm = String(target.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}`
}

export function statusText(status?: string) {
  const map: Record<string, string> = {
    pending: '待处理',
    contacted: '已联系',
    confirmed: '已确认',
    completed: '已完成',
    closed: '已关闭',
  }
  return status ? (map[status] || status) : '待处理'
}

export function timeSlotText(slot?: string) {
  const map: Record<string, string> = {
    morning: '上午 09:00-12:00',
    afternoon: '下午 12:00-17:00',
    evening: '晚间 17:00-20:00',
  }
  return slot ? (map[slot] || slot) : '—'
}

export function categoryText(category?: string | null) {
  const map: Record<string, string> = {
    exterior: '外观改装',
    interior: '内饰改装',
    function: '功能升级',
    comfort: '舒适配置',
  }
  return category ? (map[category] || category) : '其他'
}

export function parseJsonArray<T>(value: unknown): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value as T[]
  if (typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function imageList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && Boolean(item))
  }
  if (typeof value !== 'string') return []

  const parsed = parseJsonArray<string>(value)
  if (parsed.length) return parsed
  return value.startsWith('http') ? [value] : []
}

export function firstImage(value: unknown) {
  return imageList(value)[0] || ''
}

export function priceText(value?: string | number | null, fallback = '到店咨询') {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'number') return `¥${value}`
  if (value.startsWith('¥')) return value
  return value
}
