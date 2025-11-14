export interface Product {
  id: string
  sku: string
  name: string
  description: string
  active: boolean
}

export interface Webhook {
  id: string
  url: string
  eventType: string
  enabled: boolean
}

export type Tab = 'upload' | 'products' | 'webhooks'
