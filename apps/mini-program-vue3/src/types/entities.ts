export type HomeBanner = {
  text?: string
  subText?: string
  color?: string
  link?: string
  image?: string
}

export type StoreItem = {
  id: string
  name: string
  address: string
  phone: string
  businessHours?: string | null
  status: number
}

export type ProductItem = {
  id: string
  name: string
  mainImages?: string | string[] | null
  priceDescription?: string | null
  brief?: string | null
  description?: string | null
  specifications?: string | unknown[] | null
  category?: string | null
  tags?: string[]
}

export type PackageItem = {
  id: string
  name: string
  mainImages?: string | string[] | null
  price?: string | number | null
  description?: string | null
  packageProducts?: Array<{ product?: ProductItem; name?: string } | ProductItem>
  tags?: string[]
}

export type ReservationItem = {
  id: string
  orderNo: string
  status: string
  store?: Partial<StoreItem>
  storeName?: string
  product?: Partial<ProductItem>
  productName?: string
  productId?: string
  packageId?: string
  packageName?: string
  userPhone?: string
  carModel?: string
  appointmentDate?: string
  timeSlot?: string
  remark?: string
  handleRemark?: string
  statusLogs?: ReservationStatusLog[]
}

export type ReservationStatusLog = {
  oldStatus?: string | null
  newStatus: string
  remark?: string | null
  createdAt: string
}

export type UserProfile = {
  id?: string
  nickname?: string
  phone?: string
  avatarUrl?: string
}

export type BookingItemType = 'product' | 'package'

export type BookingCartItem = {
  id: string
  type: BookingItemType
  name: string
  quantity: number
  image?: string
  priceLabel?: string
  brief?: string
  category?: string | null
}
