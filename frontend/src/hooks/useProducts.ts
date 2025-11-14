import { useState, useEffect } from 'react'
import type { Product } from '../types'
import axios from 'axios'

export function useProducts() {
    // Fetch products with filters from backend
    const fetchFilteredProducts = async (filters: {
      sku?: string;
      name?: string;
      description?: string;
      active?: string;
    }) => {
      try {
        // Build params, omitting 'active' if it's empty or 'all status'
        const params: any = {
          sku: filters.sku || '',
          name: filters.name || '',
          description: filters.description || '',
        };
        if (filters.active && filters.active !== '') {
          params.active = filters.active;
        }
        const response = await API.get('/products/product', { params })
        setProducts(response.data.items)
      } catch (error) {
        console.error('Fetch filtered products error:', error)
      }
    }
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await API.get('/products/product')
      setProducts(response.data.items)
    } catch (error) {
      console.error('Fetch products error:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const createProduct = async (product: Product) => {
    try {
      const response = await API.post('/products/create_product', product)
      await fetchProducts()
      setEditingProduct(null)
      return response.data
    } catch (error: any) {
      let message = 'Create product error';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.detail) {
          message = typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : (error.response.data.detail.message || JSON.stringify(error.response.data.detail));
        }
      }
      console.error('Create product error:', message);
      return { status: false, message };
    }
  }

  const saveProduct = async (product: Product): Promise<boolean> => {
    try {
      let response;
      if (product.id) {
        response = await API.put(`/products/product/${product.sku}`, product)
        await fetchProducts()
        setEditingProduct(null)
        return response.data
      } else {
        const created = await createProduct(product)
        setEditingProduct(null)
        return created
      }
    } catch (error) {
      console.error('Save product error:', error)
      return false
    }
  }

  const deleteProduct = async (sku: string): Promise<boolean> => {
    try {
      const response = await API.delete(`/products/product/${sku}`)
      if (response.data && response.data.status) {
        setProducts(products.filter((p) => p.sku !== sku))
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Delete product error:', error)
      return false
    }
  }

  const bulkDelete = async () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await API.delete('/products/products')
        setProducts([])
        return true
      } catch (error) {
        console.error('Bulk delete error:', error)
        return false
      }
    }
    return false
  }

  return {
    products,
    setProducts,
    editingProduct,
    setEditingProduct,
    createProduct,
    saveProduct,
    deleteProduct,
    bulkDelete,
    fetchFilteredProducts,
  }
}

