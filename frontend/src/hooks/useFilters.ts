import { useState } from 'react'
import type { Product } from '../types'

export interface FilterState {
  sku: string
  name: string
  active: string
  description: string
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    sku: '',
    name: '',
    active: '',
    description: '',
  })

  const filterProducts = (products: Product[]) => {
    return products.filter((p) => {
      return (
        p.sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
        p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        p.description.toLowerCase().includes(filters.description.toLowerCase()) &&
        (filters.active === '' ||
          (filters.active === 'true' && p.active) ||
          (filters.active === 'false' && !p.active))
      )
    })
  }

  return {
    filters,
    setFilters,
    filterProducts,
  }
}

