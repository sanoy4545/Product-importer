import type { Product } from '../types'
import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useFilters } from '../hooks/useFilters'
import { useToastContext } from '../contexts/ToastContext'

interface ProductsTabProps {
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

interface SaveResult {
  status: boolean
  message?: string
}

export function ProductsTab({ uploadStatus, setUploadStatus }: ProductsTabProps) {
  const {
    products,
    editingProduct,
    setEditingProduct,
    saveProduct,
    deleteProduct,
    bulkDelete,
    fetchFilteredProducts,
  } = useProducts()

  const { filters, setFilters } = useFilters()
  const [currentPage, setCurrentPage] = useState(1)
  const { showToast } = useToastContext()

  useEffect(() => {
    fetchFilteredProducts({ ...filters, page: currentPage })
  }, [currentPage, filters])

  const paginatedProducts = products

  const handleBulkDelete = async () => {
    const success = await bulkDelete()
    if (success) {
      showToast('All products deleted successfully', 'success')
      setUploadStatus('All products deleted successfully')
      setTimeout(() => setUploadStatus(''), 3000)
    }
  }

  const handleSaveProduct = async (product: Product) => {
    if (!product.sku.trim() || !product.name.trim()) {
      showToast('SKU and Name are required', 'error')
      return
    }

    const isEdit = !!product.id

    try {
      // Ensure saveProduct returns SaveResult
      const result = await saveProduct(product) as SaveResult

      if (result && typeof result === 'object' && 'status' in result) {
        if (result.status) {
          showToast(
            result.message || (isEdit ? 'Product updated successfully' : 'Product created successfully'),
            'success'
          )
        } else {
          showToast(result.message || 'Failed to save product', 'error')
        }
      } else {
        showToast('Failed to save product', 'error')
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to save product'
      showToast(message, 'error')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    const product = products.find((p) => p.id === id)
    if (!product) {
      showToast('Product not found', 'error')
      return
    }

    const success = await deleteProduct(product.sku)
    showToast(success ? 'Product deleted successfully' : 'Failed to delete product', success ? 'success' : 'error')
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="m-0 text-3xl">Product Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setEditingProduct({ id: '', sku: '', name: '', description: '', active: true })}
            className="px-6 py-3 bg-[#646cff] text-white rounded-lg hover:bg-[#535bf2]"
          >
            Add Product
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-6 py-3 bg-[#f44336] text-white rounded-lg hover:bg-[#d32f2f]"
          >
            Delete All Products
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Filter by SKU"
          value={filters.sku}
          onChange={async (e) => {
            const newFilters = { ...filters, sku: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md bg-[#1a1a1a] text-white"
        />

        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={async (e) => {
            const newFilters = { ...filters, name: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md bg-[#1a1a1a] text-white"
        />

        <input
          type="text"
          placeholder="Filter by Description"
          value={filters.description}
          onChange={async (e) => {
            const newFilters = { ...filters, description: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md bg-[#1a1a1a] text-white"
        />

        <select
          value={filters.active}
          onChange={async (e) => {
            const newFilters = { ...filters, active: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md bg-[#1a1a1a] text-white cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-[#1a1a1a] p-8 rounded-xl max-w-[500px] w-[90%] border-2 border-[#646cff]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#646cff] text-2xl mb-6">
              {editingProduct.id ? 'Edit Product' : 'Create Product'}
            </h3>

            <div className="mb-6">
              <label className="block mb-2 text-gray-300">SKU</label>
              <input
                type="text"
                value={editingProduct.sku}
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] bg-[#242424] text-white rounded-md"
                disabled={!!editingProduct.id}
              />
              {editingProduct.id && (
                <p className="mt-2 text-sm text-gray-400">SKU cannot be edited for existing products.</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Name</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] bg-[#242424] text-white rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Description</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] bg-[#242424] text-white rounded-md min-h-[100px]"
              />
            </div>

            <div className="mb-6">
              <label className="text-gray-300">
                <input
                  type="checkbox"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-6 py-3 bg-[#646cff] text-white rounded-lg hover:bg-[#535bf2]"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mb-8 border border-[#646cff] rounded-lg">
        <table className="w-full bg-[#1a1a1a]">
          <thead>
            <tr>
              <th className="bg-[#646cff] text-white p-4 text-left">SKU</th>
              <th className="bg-[#646cff] text-white p-4 text-left">Name</th>
              <th className="bg-[#646cff] text-white p-4 text-left">Description</th>
              <th className="bg-[#646cff] text-white p-4 text-left">Status</th>
              <th className="bg-[#646cff] text-white p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-[rgba(100,108,255,0.1)]">
                <td className="p-4 border-b">{product.sku}</td>
                <td className="p-4 border-b">{product.name}</td>
                <td className="p-4 border-b">{product.description}</td>
                <td className="p-4 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.active
                        ? 'bg-[rgba(76,175,80,0.2)] text-[#4caf50]'
                        : 'bg-[rgba(244,67,54,0.2)] text-[#f44336]'
                    }`}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 mx-1 bg-[#646cff] text-white rounded-md hover:bg-[#535bf2]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 mx-1 bg-[#f44336] text-white rounded-md hover:bg-[#d32f2f]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-3 rounded-lg ${
            currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#646cff] text-white hover:bg-[#535bf2]'
          }`}
        >
          Previous
        </button>

        <span className="font-semibold">Page {currentPage}</span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={paginatedProducts.length < 10}
          className={`px-6 py-3 rounded-lg ${
            paginatedProducts.length < 10
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#646cff] text-white hover:bg-[#535bf2]'
          }`}
        >
          Next
        </button>
      </div>

      {uploadStatus && (
        <p className="mt-4 p-4 rounded-lg bg-[rgba(76,175,80,0.2)] text-[#4caf50] border border-[#4caf50]">
          {uploadStatus}
        </p>
      )}
    </div>
  )
}
